import mongoose from "mongoose";
import { MONGO_dburl } from "../config/index.js";

mongoose.set("strictQuery", false);

export default async () => {
  try {
    await mongoose.connect(MONGO_dburl);
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Failed", err);
  }
};
