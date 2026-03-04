import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;
const CSV_PATH = path.join(__dirname, '..', 'src', 'icd-dataset', 'ICD10codes.csv');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

async function importICD10Codes() {
  console.log('🚀 Starting ICD-10 code import...\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('medical-scribe');
    const collection = db.collection('icd_codes');

    // Clear existing data
    console.log('🗑️  Clearing existing ICD-10 codes...');
    await collection.deleteMany({});

    // Read and parse CSV
    const codes = [];
    let lineCount = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv({ headers: false }))
        .on('data', (row) => {
          lineCount++;
          
          // CSV structure: parentCode, subIndex, fullCode, fullDescription, altDescription, shortCategory
          const code = {
            parentCode: row[0],
            subIndex: row[1],
            code: row[2],
            description: row[3],
            altDescription: row[4],
            shortDescription: row[5],
            category: row[5], // Use short description as category
          };

          codes.push(code);

          // Show progress every 10000 lines
          if (lineCount % 10000 === 0) {
            console.log(`📊 Processed ${lineCount} codes...`);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`\n✅ Parsed ${codes.length} ICD-10 codes from CSV`);

    // Insert in batches for better performance
    const batchSize = 1000;
    let inserted = 0;

    for (let i = 0; i < codes.length; i += batchSize) {
      const batch = codes.slice(i, i + batchSize);
      await collection.insertMany(batch);
      inserted += batch.length;
      console.log(`💾 Inserted ${inserted}/${codes.length} codes...`);
    }

    // Create indexes for fast searching
    console.log('\n🔍 Creating search indexes...');
    await collection.createIndex({ code: 1 });
    await collection.createIndex({ description: 'text', shortDescription: 'text', altDescription: 'text' });
    await collection.createIndex({ parentCode: 1 });

    console.log('\n✅ ICD-10 import completed successfully!');
    console.log(`📊 Total codes imported: ${inserted}`);
    console.log('🔍 Search indexes created');

  } catch (error) {
    console.error('❌ Error during import:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

// Run the import
importICD10Codes();
