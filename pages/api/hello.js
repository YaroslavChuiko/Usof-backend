// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import prisma from "../../lib/prisma"

export default async function handler(req, res) {
  let data = await prisma.post.findMany({
    include: {
      post_likes: true,
      post_comments: true,
    }
  });
  res.status(200).json(data)
}
