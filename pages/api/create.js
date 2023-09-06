// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import {prisma} from '../../lib/prisma'


export default async function handler(req, res) {
  const { title, content } = req.body;

  try {
    await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    res.status(200).json({ message: 'Note created' });
  } catch (error) {
    console.log('Failure:', error);
    res.status(500).json({ error: 'An error occurred while creating the note' });
  }
};
