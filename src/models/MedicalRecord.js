import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export class MedicalRecord {
  static async getCollection() {
    const client = await clientPromise;
    const db = client.db('medical_transcription');
    return db.collection('medical_records');
  }

  static async create({ patientId, doctorId, recordData, sessionData = {} }) {
    const collection = await this.getCollection();
    
    const sessionDateTime = new Date();
    
    const record = {
      patientId: new ObjectId(patientId),
      doctorId: new ObjectId(doctorId),
      
      // Session Information
      sessionDate: sessionDateTime,
      sessionTime: sessionDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      
      // Note Content
      noteContent: recordData.content || '',
      templateName: sessionData.templateName || 'SOAP Note',
      templateId: sessionData.templateId || 'soap',
      
      // Session Summary (auto-generated from first 200 chars of note)
      sessionSummary: this.generateSummary(recordData.content),
      
      // ICD-10 Codes
      icdCodes: sessionData.icdCodes || [],
      
      // Transcription Data
      transcription: sessionData.transcription || '',
      dialogue: sessionData.dialogue || [],
      audioFileName: sessionData.audioFileName || '',
      
      // Metadata
      duration: sessionData.duration || 0, // in seconds
      recordingType: sessionData.recordingType || 'upload', // 'upload' or 'live'
      
      // Status
      status: 'completed',
      
      createdAt: sessionDateTime,
      updatedAt: sessionDateTime,
    };

    const result = await collection.insertOne(record);

    return {
      _id: result.insertedId,
      ...record,
    };
  }

  static generateSummary(content) {
    if (!content) return 'No summary available';
    
    // Extract first meaningful sentence or 150 characters
    const text = content.substring(0, 200).trim();
    const firstSentence = text.split('.')[0];
    
    if (firstSentence.length > 20) {
      return firstSentence + '.';
    }
    
    return text + (content.length > 200 ? '...' : '');
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
}
