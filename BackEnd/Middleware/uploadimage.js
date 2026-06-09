const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const storage = multer.diskStorage({
//     destination:(req, file, cb) => {
//         cb(null, "uploads")
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// });
// const upload = multer({
//     storage
// });
// const uploadImageProduct = upload.single("image");
// module.exports = uploadImageProduct

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const uploadImageProduct = upload.single("image");
module.exports = uploadImageProduct;