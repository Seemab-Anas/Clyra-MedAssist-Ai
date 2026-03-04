import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export class ICD10Code {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('medical-scribe');
    return db.collection('icd_codes');
  }

  // Search ICD-10 codes by text query
  static async search(query, limit = 20) {
    const collection = await this.getCollection();
    
    // Create text search or regex search
    const searchRegex = new RegExp(query, 'i');
    
    const results = await collection
      .find({
        $or: [
          { code: searchRegex },
          { description: searchRegex },
          { shortDescription: searchRegex }
        ]
      })
      .limit(limit)
      .toArray();

    return results;
  }

  // Get code by exact code match
  static async getByCode(code) {
    const collection = await this.getCollection();
    return await collection.findOne({ code: code.toUpperCase() });
  }

  // Get multiple codes by array of code strings
  static async getByCodes(codes) {
    const collection = await this.getCollection();
    return await collection
      .find({ code: { $in: codes.map(c => c.toUpperCase()) } })
      .toArray();
  }

  // Create text index for better search (run once during setup)
  static async createIndexes() {
    const collection = await this.getCollection();
    await collection.createIndex({ code: 1 });
    await collection.createIndex({ description: 'text', shortDescription: 'text' });
  }
}

export default ICD10Code;
