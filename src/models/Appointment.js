import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export class Appointment {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('medical_transcription');
    return db.collection('appointments');
  }

  static async create({ patientId, doctorId, appointmentDate, appointmentTime, duration, reason, notes }) {
    const collection = await this.getCollection();
    
    const appointment = {
      patientId: new ObjectId(patientId),
      doctorId: new ObjectId(doctorId),
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      duration: duration || 30, // default 30 minutes
      reason: reason || '',
      notes: notes || '',
      status: 'scheduled', // scheduled, completed, cancelled, no-show
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(appointment);

    return {
      _id: result.insertedId,
      ...appointment,
    };
  }

  static async findByDoctor(doctorId, startDate = null, endDate = null) {
    const collection = await this.getCollection();
    
    const query = { doctorId: new ObjectId(doctorId) };
    
    if (startDate && endDate) {
      query.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    return await collection
      .find(query)
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .toArray();
  }

  static async findByPatient(patientId) {
    const collection = await this.getCollection();
    return await collection
      .find({ patientId: new ObjectId(patientId) })
      .sort({ appointmentDate: -1 })
      .toArray();
  }

  static async findById(id) {
    const collection = await this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async update(id, updateData) {
    const collection = await this.getCollection();
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    return result.modifiedCount > 0;
  }

  static async delete(id) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  // Get today's appointments
  static async getTodayAppointments(doctorId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.findByDoctor(doctorId, today, tomorrow);
  }

  // Get upcoming appointments
  static async getUpcomingAppointments(doctorId, limit = 10) {
    const collection = await this.getCollection();
    const now = new Date();

    return await collection
      .find({
        doctorId: new ObjectId(doctorId),
        appointmentDate: { $gte: now },
        status: 'scheduled'
      })
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit)
      .toArray();
  }
}
