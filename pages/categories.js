import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

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
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName(""); // Clear the input field after successfull submission
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Pokračovať v tejto akcii?",
        text: `Chcete naozaj odstrániť sekciu "${category.name}"?`,
        showCancelButton: true,
        cancelButtonText: "Zrušiť",
        confirmButtonText: "Odstrániť",
        confirmButtonColor: "purple", //#d55
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
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
          <form onSubmit={saveCategory}>
            <div className="flex gap-1">
              <input
                type="text"
                placeholder={"Názov kategórie"}
                onChange={(ev) => setName(ev.target.value)}
                value={name}
              />
              <select
                value={parentCategory}
                onChange={(ev) => setParentCategory(ev.target.value)}
              >
                <option value="0">Žiadna sekcia</option>
                {categories.length > 0 &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block">Vlastnosti</label>
              <button
                type="button"
                onClick={addProperty}
                className="btn-default text-sm mb-2"
              >
                Pridaj novú vlastnosť
              </button>
              {properties.length > 0 &&
                properties.map((property, index) => (
                  <div className="flex gap-1 mb-2">
                    <input
                      type="text"
                      value={property.name}
                      className="mb-0"
                      onChange={(ev) =>
                        handlePropertyNameChange(
                          index,
                          property,
                          ev.target.value
                        )
                      }
                      placeholder="Názov vlastnosti (napr. Palivo)"
                    />
                    <input
                      type="text"
                      value={property.values}
                      className="mb-0"
                      onChange={(ev) =>
                        handlePropertyValuesChange(
                          index,
                          property,
                          ev.target.value
                        )
                      }
                      placeholder="hodnoty oddelené čiarkou"
                    />
                    <button
                      onClick={() => removeProperty(index)}
                      type="button"
                      className="btn-default"
                    >
                      Odstrániť
                    </button>
                  </div>
                ))}
            </div>
            <div className="flex gap-1">
              {editedCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditedCategory(null);
                    setName("");
                    setParentCategory("");
                    setProperties([]);
                  }}
                  className="btn-default"
                >
                  Zrušiť
                </button>
              )}
              <button type="submit" className="btn-primary py-1 max-h-fit">
                Ulož
              </button>
            </div>
          </form>
          {!editedCategory && (
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
                          className="flex items-center gap-1 btn-default"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                          Uprav
                        </button>
                        <button
                          onClick={() => deleteCategory(category)}
                          className="btn-primary"
                        >
                          Vymaž
                        </button>
                      </div>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
