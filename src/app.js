import "./config/env.js";
import mongoose from "mongoose";
import app from "./config/express.js";

// boostrap == arranque de aplicacion
const boostrap = async () => {
  await mongoose.connect(process.env.URL_MONGODB).then(() => {
    console.log(`Connected to the database`);
  });

  const PORT = process.env.PORT;
  const HOST = process.env.HOST;

  app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
  });
};

boostrap();
