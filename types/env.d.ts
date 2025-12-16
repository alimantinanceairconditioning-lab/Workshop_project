declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // MongoDB
      MONGODB_URI: string;
      MONGO_URI: string;
      
      // Authentication
      JWT_SECRET: string;
      
      // Cloudinary
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: string;
      CLOUDINARY_API_KEY: string;
      CLOUDINARY_API_SECRET: string;
      
      // Node
      NODE_ENV: 'development' | 'production' | 'test';
    }
  }
}

export {};
