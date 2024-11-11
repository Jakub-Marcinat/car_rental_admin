import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [productProperties, setProductProperties] = useState(
    assignedProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

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

  //function to upload images of the "product"
  async function uploadImages(ev) {
    const files = ev.target?.files;

    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      //Creates a new array with all of the images (old and new links to the images)
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  const updateImagesOrder = (newOrder) => {
    setImages([...newOrder]);
  };

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    // Find the selected category
    let catInfo = categories.find(({ _id }) => _id === category);

    // If the category exists, push its properties
    if (catInfo?.properties) {
      propertiesToFill.push(...catInfo.properties);
    }

    // Loop through parent categories, if any
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo.parent._id
      );

      // Check if the parent category exists and has properties
      if (parentCat?.properties) {
        propertiesToFill.push(...parentCat.properties);
      }

      catInfo = parentCat; // Move up to the next parent
    }
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
      <label>Kategória</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value="">Nezaradené</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div className="">
            <label className="first-letter:uppercase">{p.name}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Fotky</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-32 bg-white p-2 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-32 h-32 flex flex-col items-center justify-center text-sm gap-1 text-gray-600 rounded-sm bg-white shadow-sm border border-primary cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Pridať fotografie</div>
          <input type="file" className=" hidden" onChange={uploadImages} />
        </label>
        {/* {!images?.length && <div>Neboli nájdené žiadne fotografie.</div>} */}
      </div>

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
