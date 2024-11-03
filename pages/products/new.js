import Layout from "@/components/layout";
import axios from "axios";
import { useState } from "react";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setprice] = useState("");

  async function createProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price };
    await axios.post("/api/products", data);
  }

  return (
    <Layout>
      <form onSubmit={createProduct} className="flex flex-col shrink">
        <h1>Nový produkt</h1>
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
          onChange={(ev) => setprice(ev.target.value)}
        />
        <button type="submit" className="btn-primary max-w-fit">
          Ulož
        </button>
      </form>
    </Layout>
  );
}
