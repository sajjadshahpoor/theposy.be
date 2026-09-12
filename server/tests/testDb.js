import mongoose from "mongoose";

// Jest runs test files in parallel worker processes; scoping the database
// name by worker id keeps concurrently-running files from clobbering each
// other's data via afterEach cleanup.
const TEST_MONGO_URI = `mongodb://localhost:27017/theposy_test_${process.env.JEST_WORKER_ID || "0"}`;

export async function connectTestDb() {
  await mongoose.connect(TEST_MONGO_URI);
}

export async function clearTestDb() {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
}

export async function disconnectTestDb() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}
