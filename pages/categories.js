import Layout from "@/components/layout";
import axios from "axios";
import { useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");

  async function saveCategory(ev) {
    ev.preventDefault();
    await axios.post("/api/categories", { name });
    setName(""); // Clear the input field after successful submission
  }

  return (
    <Layout>
      <div>
        <h1>Kategórie</h1>
        <div className="flex flex-col gap-1">
          <label>Meno kategórie</label>
          <form onSubmit={saveCategory} className="flex gap-1">
            <input
              type="text"
              className="mb-0"
              placeholder={"Category name"}
              onChange={(ev) => setName(ev.target.value)}
              value={name}
            ></input>

            <button type="submit" className="btn-primary py-1 max-h-fit">
              Ulož
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
