import app from './app';
import { connectDB } from './db/connection';

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[+] Server is running http://localhost:${PORT}`);
  });
}

startServer();
