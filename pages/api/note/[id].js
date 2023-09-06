// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const { prisma } = require("../../../lib/prisma");

module.exports = async (req, res) => {
  const noteId = req.query.id;

  if (req.method === 'DELETE') {
    try {
      const note = await prisma.note.delete({
        where: { id: Number(noteId) }
      });
      res.json(note);
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  } else {
    console.log("Note could not be deleted");
    res.status(405).json({ error: "Method not allowed" });
  }
};

