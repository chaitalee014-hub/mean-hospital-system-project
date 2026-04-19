import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "doctors", // folder name in cloudinary
    allowed_formats: ["jpg", "png", "jpeg"]
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;

  if (allowedTypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"));
  }
};

export default multer({ storage, fileFilter });