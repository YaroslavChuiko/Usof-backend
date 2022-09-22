import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// export const uploadAvatar = multer({
//   storage: multer.diskStorage({
//       // destination: path.join(process.cwd(), 'public', 'images', 'user', userData.id, 'avatar'), // destination folder
//       destination: path.join(process.cwd(), 'public', 'images', 'user', 'avatar'), // destination folder
//       // filename: (req, file, cb) => cb(null, getFileName(file)),
//       filename: uuidv4() + "-" + new Date().getTime(),
//   }),
// }).single('avatar');//avatar


const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const dirPath = path.resolve( 'public', 'uploads', 'user', 'avatar');
    console.log(dirPath);
      if (!fs.existsSync(dirPath)){
          fs.mkdirSync(dirPath, {recursive: true});
      }
    callback(null, dirPath);
  },
  filename: (req, file, callback) => {
    callback(null, getFileName(file));
  },
});

export const uploadAvatar = multer({ storage: storage }).single('avatar');

const getFileName = file => {
  let filename = uuidv4() + '-' + new Date().getTime();
  filename += '.' + file.originalname.substring(file.originalname.lastIndexOf('.') + 1, file.originalname.length);

  return filename;
};

const imgFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback('Please upload files in an image format', false);
  }
};

// const storage = multer.diskStorage({

//   destination: (req, file, callback) => {
//       const dirPath = path.resolve("public/uploads");
//       if (!fs.existsSync(dirPath)){
//           fs.mkdirSync(dirPath);
//       }
//       callback(null, dirPath);
//   },
//   filename: (req, file, callback) => {
//       callback(null, `${Date.now()}-userfile-${file.originalname}`);
//   }
// });
// const upload = multer({ storage: storage, fileFilter: imgFilter })
//       .single("avatar");

// function fileUpload(req, res, next) {

//   const upload = multer({ storage: storage, fileFilter: imgFilter })
//       .single("avatar");

//   upload(req, res, function (err) {

//       if (err) {
//           return res.json({ text: err, type: "error" });
//       }
//       next();

//   });

// }
