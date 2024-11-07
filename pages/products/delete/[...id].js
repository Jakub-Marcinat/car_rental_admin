import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, [id]);

  function goBack() {
    router.push("/products");
  }

  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }

  return (
    <Layout>
      <div>
        <h1>Chcete naozaj odstrániť&nbsp;&quot;{productInfo?.title}&quot;?</h1>
        <div className="flex gap-2 ">
          <button className="btn-success" onClick={deleteProduct}>
            Áno
          </button>
          <button className="btn-default" onClick={goBack}>
            Nie
          </button>
        </div>
      </div>
    </Layout>
  );
}
