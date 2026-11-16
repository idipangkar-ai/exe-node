import { env } from './config/env.js';
import app from './app.js';
import connectDB from './config/database.js';

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`EXE-NODE server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};

startServer();