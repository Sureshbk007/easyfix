import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 100);
    const fileExtension = path.extname(file.originalname);
    cb(null, "Img-" + uniqueSuffix + fileExtension);
  },
});

export const upload = multer({ storage: storage });
