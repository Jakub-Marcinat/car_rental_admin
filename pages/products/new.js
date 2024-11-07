import Layout from "@/components/layout";
import ProductForm from "@/components/ProductForm";

export default function NewProduct() {
  return (
    <Layout>
      <div>
        <h1>Nový produkt</h1>
        <ProductForm />
      </div>
    </Layout>
  );
}
