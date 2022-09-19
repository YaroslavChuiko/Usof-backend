// import multer from 'multer';
import formidable from 'formidable';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { withAuthUser } from '../../../util/auth';
import { uploadAvatar } from '../../../lib/multer';

export const config = {
  api: {
    bodyParser: false,
  },
};

// /api/users/avatar
export default async function handler(req, res) {
  if (req.method === 'POST') { // ! replace  ot PATCH
    handlePATCH(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

const options = {
  multiples: false,
  keepExtensions: true,
  // uploadDir: path.join(process.cwd(), 'public', 'uploads', 'user', 'avatar'), // do not create new folder
  filter: ({ name, originalFilename, mimetype }) => {
    if (name === 'avatar' && (!mimetype || !mimetype.includes('image'))) {
      throw new Error('Please upload file in an image format');
    }
    return mimetype && mimetype.includes('image');
  },
  filename: (name, exp, part, form) => {
    return `${uuidv4()}-${new Date().getTime()}${exp}`;
  },
};

const saveAvatar = async file => {
  // console.log(file);
  const data = fs.readFileSync(file.filepath);
  const filePath = path.join(process.cwd(), 'public', 'uploads', 'user', 'avatar');
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
  // fs.writeFileSync(path.join(filePath, getFileName(file)), data);
  fs.writeFileSync(path.join(filePath, file.newFilename), data);
  fs.unlinkSync(file.filepath);
  return;
};

// const getFileName = file => {
//   let filename = uuidv4() + '-' + new Date().getTime();
//   filename += '.' + file.originalFilename.substring(file.originalFilename.lastIndexOf('.') + 1, file.originalFilename.length);

//   return filename;
// };

// PATCH /api/users/avatar
async function handlePATCH(req, res) {
  //https://codesandbox.io/s/thyb0?file=/pages/index.js
  // res.setHeader('Access-Control-Allow-Origin', '*');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // res.setHeader('Access-Control-Max-Age', '1800');
  // res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH, OPTIONS');

  const form = new formidable.IncomingForm(options);
  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log(err);
      return res.status(415).send(err.message);
    }
    // console.log(files);
    try { 
      await saveAvatar(files.avatar);

      //upadate database
      // fs.rmSync(filePath); when update user avayar delete old one
      
      return res.status(200).send('');
    } catch (error) {
      console.log(error);
      return res.status(500).send('UnknownError');
    }
  });

  // 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
  // Users image : /user/{id}/avatar/img.png
  // Product image: /product/{id}/1.png

  // uploadAvatar(req, res, err => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send('UnknownError');
  //     // An unknown error occurred when uploading.
  //   }
  //   // Everything went fine.
  // });
}
