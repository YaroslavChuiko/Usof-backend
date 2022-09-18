import fs from 'fs';
import path from 'path';

// /api/images/[...slug]
export default async function handler(req, res) {
  if (req.method === 'GET') {
    handleGET(req, res);
  } else {
    res.status(405).end(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

// GET /api/images/[...slug]
async function handleGET(req, res) {
  // 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
  // Users image : /user/{id}/avatar/img.png
  // Product image: /product/{id}/1.png
  const {slug} = req.query;
  const imgPath = path.join(process.cwd(), '/public/images/', ...slug);
  const img = fs.readFileSync(imgPath);

  res.removeHeader('Content-Type');
  res.setHeader('Content-Type', 'image/png');

  // res.status(304).send(img);
  res.status(200).send(img);
}
