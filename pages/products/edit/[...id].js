import Layout from "@/components/layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();

  //getting product by its ID
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  return (
    <Layout>
      <div>
        <h1>Upraviť produkt</h1>
        {productInfo && <ProductForm {...productInfo} />}
      </div>
    </Layout>
  );
}
