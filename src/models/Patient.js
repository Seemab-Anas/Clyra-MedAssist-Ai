import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export class Patient {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('medical_transcription');
    return db.collection('patients');
  }

  static async create({ doctorId, name, age, sex, dob, mrn }) {
    const collection = await this.getCollection();
    
    const result = await collection.insertOne({
      doctorId: new ObjectId(doctorId),
      name,
      age,
      sex,
      dob,
      mrn,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      _id: result.insertedId,
      doctorId,
      name,
      age,
      sex,
      dob,
      mrn,
    };
  }

  static async findByDoctor(doctorId) {
    const collection = await this.getCollection();
    return await collection
      .find({ doctorId: new ObjectId(doctorId) })
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async update(id, data) {
    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...data,
          updatedAt: new Date() 
        } 
      }
    );
    return result;
  }
}
