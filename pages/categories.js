import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = { name, parentCategory };
    if (editCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }

    setName(""); // Clear the input field after successful submission
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  return (
    <Layout>
      <div>
        <h1>Kategórie</h1>
        <div className="flex flex-col gap-1">
          <label>
            {editedCategory
              ? `Uprav kategóriu "${editedCategory.name}"`
              : "Vytvor novú kategóriu"}{" "}
          </label>
          <form onSubmit={saveCategory} className="flex gap-1">
            <input
              type="text"
              className="mb-0"
              placeholder={"Category name"}
              onChange={(ev) => setName(ev.target.value)}
              value={name}
            />
            <select
              className="mb-0"
              value={parentCategory}
              onChange={(ev) => setParentCategory(ev.target.value)}
            >
              <option value="">Žiadna sekcia</option>
              {categories.length > 0 &&
                categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>

            <button type="submit" className="btn-primary py-1 max-h-fit">
              Ulož
            </button>
          </form>
          <table className="basic mt-4">
            <thead>
              <tr>
                <td>Názov kategórie</td>
                <td>Názov sekcie</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map((category) => (
                  <tr>
                    <td>{category.name}</td>
                    <td>{category?.parent?.name}</td>
                    <div className="flex gap-2 px-2 py-1">
                      <button
                        onClick={() => editCategory(category)}
                        className="btn-primary"
                      >
                        Edit
                      </button>
                      <button className="btn-primary">Delete</button>
                    </div>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
