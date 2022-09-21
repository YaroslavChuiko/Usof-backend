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
  const {slug} = req.query;
  const imgPath = path.join(process.cwd(), 'public', 'uploads', ...slug);
  
  try {
    const img = fs.readFileSync(imgPath);
    
    res.removeHeader('Content-Type');
    res.setHeader('Content-Type', 'image/png');

    res.status(200).send(img);
    // res.status(304).send(img); //304 cashing
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
}
