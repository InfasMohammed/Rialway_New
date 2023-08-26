// import cloudinary from "./Cloudinary.js";

// export const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.v2.uploader.upload_stream(
//       { folder: "trainbooking" },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );

//     stream.end(buffer);
//   });
// };

// import cloudinary from "./Cloudinary.js";


// Initialize Cloudinary with your cloud_name, api_key, and api_secret
// cloudinary.config({
//   cloud_name: CLOUDINARY_CLOUD_NAME, 
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
// });

// export const uploadToCloudinary = (imageBuffer) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.v2.uploader.upload_stream(
//       { resource_type: "auto" },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result);
//         }
//       }
//     ).end(imageBuffer);
//   });
// };

import cloudinary from "./Cloudinary.js";
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../config/index.js";

// Initialize Cloudinary with your cloud_name, api_key, and api_secret
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME, 
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(imageBuffer);
  });
};

