// global.d.ts
import { MongoClient } from 'mongodb';

declare global {
  // MongoDB
  var _mongoClientPromise: Promise<MongoClient> | undefined;

  // MiniKit
  interface MiniKitGlobal {
    isInstalled?: () => Promise<boolean>;
  }

  interface Window {
    MiniKit?: MiniKitGlobal;
  }
}

export {};
