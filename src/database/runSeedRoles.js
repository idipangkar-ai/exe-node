
import 'dotenv/config';

import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import seedRoles from './seedRoles.js';

// Connect to MongoDB, seed default roles, and close the connection.
const run = async () => {
  try {
    await connectDB();

    const count = await seedRoles();

    console.log(`Successfully seeded ${count} default roles.`);
  } catch (error) {
    console.error('Role seeding failed:', error);
    process.exitCode = 1;
  } finally {
    // Close the database connection after seeding.
    await mongoose.disconnect();
  }
};

run();
