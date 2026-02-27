import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export class MedicalRecord {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('medical_transcription');
    return db.collection('medical_records');
  }

  static async create({ patientId, doctorId, recordData }) {
    const collection = await this.getCollection();
    
    const result = await collection.insertOne({
      patientId: new ObjectId(patientId),
      doctorId: new ObjectId(doctorId),
      ...recordData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      _id: result.insertedId,
      patientId,
      doctorId,
      ...recordData,
    };
  }

  static async findByPatient(patientId) {
    const collection = await this.getCollection();
    return await collection
      .find({ patientId: new ObjectId(patientId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async getLatestByPatient(patientId) {
    const collection = await this.getCollection();
    return await collection
      .findOne({ patientId: new ObjectId(patientId) })
      .sort({ createdAt: -1 });
  }
}
