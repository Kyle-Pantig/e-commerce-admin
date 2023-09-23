import { HandleContext } from "@/components/HandleContext";
import Layout from "@/components/Layout";
import ProductLoader from "@/components/Loader/ProductLoader";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const EditProductPage = () => {
  const [productInfo, setProductInfo] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { isCanceled } = useContext(HandleContext);

  useEffect(() => {
    if (!id) {
      return;
    }
    setisLoading(true);
    axios.get("/api/products?id=" + id).then((response) => {
      setProductInfo(response.data);
      setisLoading(false);
    });
  }, [id]);

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={() => isCanceled()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <h1>Edit Product</h1>
      </div>
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>{productInfo && <ProductForm {...productInfo} />}</>
      )}
    </Layout>
  );
};

export default EditProductPage;
