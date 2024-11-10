import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handleCategories(req, res) {
  await mongooseConnect(); // Ensure MongoDB connection

  const { method } = req;

  if (method === "POST") {
    try {
      const { name } = req.body;
      const categoryDoc = await Category.create({ name });
      return res.json(categoryDoc);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Failed to create category" });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
