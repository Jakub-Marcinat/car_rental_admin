import mongoose from "mongoose";

export async function mongooseConnect() {
  // Check if MONGODB_URI is defined
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing environment variable: MONGODB_URI");
  }

  // Use the existing connection if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  try {
    // Connect to MongoDB
    return await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("MongoDB connection error");
  }
}
