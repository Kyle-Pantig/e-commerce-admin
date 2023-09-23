import Layout from "@/components/Layout";
import ProductLoader from "@/components/Loader/ProductLoader";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

const Settings = ({ swal }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featured, setFeatured] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchAll().then(() => {
      setIsLoading(false);
    });
  }, []);

  const fetchAll = async () => {
    await axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
    await axios.get("/api/settings?name=featuredProductId").then((response) => {
      setFeatured(response.data.value);
    });
    await axios.get("/api/settings?name=shippingFee").then((response) => {
      setShippingFee(response.data.value);
    });
  };

  const saveSettings = async () => {
    setIsLoading(true);
    await axios.put("/api/settings", {
      name: "featuredProductId",
      value: featured,
    });

    await axios.put("/api/settings", {
      name: "shippingFee",
      value: shippingFee,
    });
    setIsLoading(false);
    await swal.fire({
      text: "Settings saved!",
      icon: "success",
    });
  };

  return (
    <Layout>
      <h1>Settings</h1>
      {isLoading && <ProductLoader />}
      {!isLoading && (
        <>
          <label>Featured product</label>
          <select
            value={featured}
            onChange={(event) => setFeatured(event.target.value)}
          >
            {products.length > 0 &&
              products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
          </select>
          <label>Shipping fee (peso)</label>
          <input
            type="number"
            value={shippingFee}
            onChange={(event) => setShippingFee(event.target.value)}
          />
          <div className="btn-primary w-max">
            <button onClick={saveSettings}>Save settings</button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default withSwal(({ swal }) => <Settings swal={swal} />);
