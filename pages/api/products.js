import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  try {
    if (method === "GET") {
      if (req.query?.id) {
        const product = await Product.findOne({ _id: req.query.id });
        return res.json(product); // Return single product
      } else {
        const products = await Product.find();
        return res.json(products); // Return all products
      }
    }

    if (method === "POST") {
      const { title, description, price, images, category, properties } =
        req.body;
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties,
      });
      return res.json(productDoc); // Send the newly created product
    }

    if (method === "PUT") {
      const { title, description, price, images, category, properties, _id } =
        req.body;
      await Product.updateOne(
        { _id },
        { title, description, price, images, category, properties }
      );
      return res.json(true); // Confirm update success
    }

    if (method === "DELETE") {
      if (req.query?.id) {
        await Product.deleteOne({ _id: req.query.id });
        return res.json(true); // Confirm deletion success
      }
    }

    // Return 405 for unsupported methods
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error("Error in /api/products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
