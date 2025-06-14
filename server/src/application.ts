import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import Routes from "./routes";
import runSeeders from "./seeders";
import { errorMiddleware } from "./middlewares/error.middleware";
import passport from "passport";
import { configureJwtStrategy } from "./middlewares/jwt.middleware";
import * as Models from "./models";

class Application {
  public server;

  constructor() {
    this.server = express();

    this.environment();
    this.database();
    this.middlewares();
    this.passport();
    this.routes();
    this.initDirectories();
  }

  private environment() {
    // Only load .env if MONGODB_URI is not set in environment
    if (!process.env.MONGODB_URI) {
      dotenv.config();
    }
    console.log('Environment variables loaded:');
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('PORT:', process.env.PORT);
  }

  private middlewares() {
    this.server.use(cors({
      origin: "http://localhost:5173",
      credentials: true
    }));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
  }

  private routes() {
    new Routes(this.server);
    this.server.use(errorMiddleware);
  }

  private initDirectories() {
    // Public directory
    if (!fs.existsSync(path.join(__dirname, "../public"))) {
      fs.mkdirSync(path.join(__dirname, "../public"));
    }

    // Resume directory
    if (!fs.existsSync(path.join(__dirname, "../public/resumes"))) {
      fs.mkdirSync(path.join(__dirname, "../public/resumes"));
    }

    // Uploads directory
    if (!fs.existsSync(path.join(__dirname, "../public/uploads"))) {
      fs.mkdirSync(path.join(__dirname, "../public/uploads"));
    }
  }

  private async database() {
    const MONGO_URL: string = process.env.MONGODB_URI || "";
    console.log('Attempting to connect to MongoDB with URI:', MONGO_URL);
    const maxRetries = 5;
    let retryCount = 0;

    const options: ConnectOptions = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    };

    const connectWithRetry = async () => {
      try {
        await mongoose.connect(MONGO_URL, options);
        console.log(`✅[Server]: Database is connected`);
        
        // Verify all models are registered
        console.log('Verifying model registration...');
        Object.keys(Models).forEach(modelName => {
          if (mongoose.models[modelName]) {
            console.log(`✅ Model registered: ${modelName}`);
          } else {
            console.error(`❌ Model not registered: ${modelName}`);
          }
        });
        
        // Run the seeders
        await runSeeders();
      } catch (error) {
        console.log(`❌[Server] Database connection error: ${error}`);
        retryCount++;
        
        if (retryCount < maxRetries) {
          console.log(`Retrying database connection... (${retryCount}/${maxRetries})`);
          setTimeout(connectWithRetry, 5000);
        } else {
          console.log('Max retries reached. Could not connect to database.');
          process.exit(1);
        }
      }
    };

    await connectWithRetry();
  }

  private passport() {
    this.server.use(passport.initialize());
    configureJwtStrategy(passport);
  }

  public start() {
    const PORT: number = process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 5050;
    this.server
      .listen(PORT, () => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            `⚡️[Server]: Server is running at http://localhost:${PORT}`
          );
        } else {
          console.log(`⚡️[Server]: Server is running`);
        }
      })
      .on("error", (err: any) => {
        if (err.code === "EADDRINUSE") {
          console.log(`❌ Error: address already in use`);
        } else {
          console.log(err);
        }
      });
  }
}

export default Application;
