import mongoose from 'mongoose';

interface ConnectionOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

const DEFAULT_OPTIONS: ConnectionOptions = {
  maxRetries: 5,
  retryDelay: 5000,
  timeout: 30000
};

export const connectDB = async (options: ConnectionOptions = DEFAULT_OPTIONS): Promise<void> => {
  const { maxRetries, retryDelay, timeout } = { ...DEFAULT_OPTIONS, ...options };
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';
  
  let retries = 0;
  
  while (retries < maxRetries!) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: timeout,
        maxPoolSize: 10,
        minPoolSize: 5,
        maxIdleTimeMS: 30000
      });
      
      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🔗 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
      console.log(`🔄 Retry attempts: ${retries}`);
      
      return;
      
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries} failed:`, error instanceof Error ? error.message : error);
      
      if (retries >= maxRetries!) {
        console.error(`💀 Failed to connect to MongoDB after ${maxRetries} attempts`);
        process.exit(1);
      }
      
      console.log(`⏳ Retrying in ${retryDelay}ms... (${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🚨 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed gracefully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

export const isConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const getConnectionState = (): string => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
};

export const getConnectionInfo = () => {
  if (!isConnected()) {
    return { connected: false, state: getConnectionState() };
  }
  
  return {
    connected: true,
    state: getConnectionState(),
    database: mongoose.connection.name,
    host: mongoose.connection.host,
    port: mongoose.connection.port
  };
};

// Handle process termination
const gracefulShutdown = async (signal: string) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  try {
    await disconnectDB();
    console.log('👋 Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));