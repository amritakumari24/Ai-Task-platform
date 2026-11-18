
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);

    if (error.reason?.servers) {
      for (const [address, server] of error.reason.servers) {
        console.error("MongoDB server:", address, {
          type: server.type,
          error: server.error?.message,
          errorCode: server.error?.code,
          errorName: server.error?.name,
        });
      }
    }

    process.exit(1);
  }
};

module.exports = connectDB;
