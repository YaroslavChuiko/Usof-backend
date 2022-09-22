import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../../../lib/prisma';
import SimpleCRUD from '../../../logic/SimpleCRUD';
import { withAuthUser } from '../../../util/auth';
import { DEFAULT_AVATAR_PATH, UPLOADS_PATH } from '../../../util/const';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

// /api/users/avatar
export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const result = withAuthUser(req, res);
    if (!result.success) return;
    req.user = result.decoded;

    handlePATCH(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// PATCH /api/users/avatar
async function handlePATCH(req, res) {
  const form = new formidable.IncomingForm(options);

  form.parse(req, async function (err, fields, files) {
    if (err) {
      console.log(err);
      return res.status(415).send(err.message);
    }

    try {
      const userId = req.user.id;
      const avatarPath = await saveAvatar(files.avatar, userId);

      const user = await SimpleCRUD.getOne(userId, prisma.user); // get user before update profile_picture

      const dataToUpdate = {
        profile_picture: avatarPath,
      };

      const updatedUser = await SimpleCRUD.update(userId, dataToUpdate, prisma.user);

      deleteOldAvatar(user.profile_picture);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.log(error);
      return res.status(500).send('UnknownError');
    }
  });
}

const saveAvatar = async (file, userId) => {
  const avatarPath = path.join('user', `${userId}`, 'avatar');
  const filePath = path.join(UPLOADS_PATH, avatarPath);
  const data = fs.readFileSync(file.filepath);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }

  fs.writeFileSync(path.join(filePath, file.newFilename), data);
  fs.unlinkSync(file.filepath);

  return path.join(avatarPath, file.newFilename);
};

function deleteOldAvatar(avatarPath) {
  if (avatarPath !== DEFAULT_AVATAR_PATH) {
    fs.rmSync(path.join(UPLOADS_PATH, avatarPath));
  }
}
