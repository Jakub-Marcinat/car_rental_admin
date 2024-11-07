import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };

    if (_id) {
      //update a product
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create a product
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={saveProduct} className="flex flex-col shrink">
      <label>Názov produktu</label>
      <input
        type="text"
        placeholder="Názov produktu"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Popis</label>
      <textarea
        placeholder="Popis"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>
      <label>Cena [€]</label>
      <input
        type="number"
        placeholder="Cena"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type="submit" className="btn-primary max-w-fit">
        Ulož
      </button>
    </form>
  );
}
