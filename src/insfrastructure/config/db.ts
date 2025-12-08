import mongoose from 'mongoose'

class Database {
  private static instance: Database
  private isConnected = false
  private constructor() {}

  public static getInstance(): Database {
    if (!this.instance) {
      this.instance = new Database()
    }
    return this.instance
  }

  public async connect(connectionString: string): Promise<void> {
    if (this.isConnected) return

    try {
      await mongoose.connect(connectionString)
      this.isConnected = true
      console.log('✅ MongoDB connected')
    } catch (error) {
      console.error('❌ MongoDB connection error:', error)
      process.exit(1)
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) return
    await mongoose.disconnect()
    this.isConnected = false
    console.log('🛑 MongoDB disconnected')
  }
}

export const db = Database.getInstance()
