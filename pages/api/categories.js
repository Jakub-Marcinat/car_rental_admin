import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handleCategories(req, res) {
  await mongooseConnect(); // Ensure MongoDB connection

  const { method } = req;

  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
  }

  if (method === "POST") {
    try {
      const { name, parentCategory } = req.body;
      const categoryDoc = await Category.create({
        name,
        parent: parentCategory,
      });
      return res.json(categoryDoc);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Failed to create category" });
    }
  }

  if (method === "PUT") {
    try {
      const { name, parentCategory, _id } = req.body;
      //{first obj what you want to update} then {obj of the new data}
      const categoryDoc = await Category.updateOne(
        { _id: _id },
        {
          name,
          parent: parentCategory,
        }
      );
      return res.json(categoryDoc);
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ error: "Failed to create category" });
    }
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id: _id });
    res.json("ok");
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
