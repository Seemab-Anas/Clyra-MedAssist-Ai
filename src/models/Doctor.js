import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export class Doctor {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('medical_transcription');
    return db.collection('doctors');
  }

  static async create({ name, email, password, specialization }) {
    const collection = await this.getCollection();
    
    // Check if doctor already exists
    const existingDoctor = await collection.findOne({ email });
    if (existingDoctor) {
      throw new Error('Doctor with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor
    const result = await collection.insertOne({
      name,
      email,
      password: hashedPassword,
      specialization,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      _id: result.insertedId,
      name,
      email,
      specialization,
    };
  }

  static async findByEmail(email) {
    const collection = await this.getCollection();
    return await collection.findOne({ email });
  }

  static async findById(id) {
    const collection = await this.getCollection();
    const { ObjectId } = require('mongodb');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
