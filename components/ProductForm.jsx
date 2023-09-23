import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import ProductLoader from "./Loader/ProductLoader";
import { HandleContext } from "./HandleContext";

const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  quantity: existingQuantity,
  images: existingImages,
  category: assignCategory,
  properties: assignProperties,
}) => {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignCategory || "");
  const [productProperties, setProductProperties] = useState(
    assignProperties || {}
  );
  const [price, setPrice] = useState(existingPrice || "");
  const [quantity, setQuantity] = useState(existingQuantity || "");
  const [images, setImages] = useState(existingImages || []);
  const [goToProduct, setGoToProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDeletingImage, setIsDeletingImage] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const router = useRouter();
  const { editedProduct, handleInputChange, isCanceled } =
    useContext(HandleContext);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsLoad(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoad(false);
    });
  }, []);

  const saveProduct = async (event) => {
    event.preventDefault();

    if (!category) {
      alert("Please select a category for the product.");
      return;
    }

    const uploadedImages = await uploadImagesToCloudinary(newImages);
    const data = {
      title,
      description,
      price,
      quantity,
      images: [...images, ...uploadedImages],
      category,
      properties: productProperties,
    };
    if (_id) {
      //update product
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create new product
      await axios.post("/api/products", data);
    }
    setGoToProduct(true);
  };
  if (goToProduct) {
    router.push("/products");
  }

  const uploadImagesToCloudinary = async (selectedImages) => {
    const uploadedImages = [];

    for (const file of selectedImages) {
      setIsUploading(true);
      const data = new FormData();
      data.append("file", file);

      const res = await axios.post("/api/upload", data);

      if (res.data.links.length > 0) {
        uploadedImages.push(...res.data.links);
      }
      setIsUploading(false);
    }

    return uploadedImages;
  };

  const updateImagesOrder = (images) => {
    setImages(images);
  };
  const updateNewImagesOrder = (newImages) => {
    setNewImages(newImages);
  };

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  const setProductProp = (propName, value) => {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  };

  const deleteImageProduct = async (public_id) => {
    const { id } = router.query;
    setIsDeletingImage(public_id);

    if (id) {
      await axios.delete(`/api/upload?id=${id}&public_id=${public_id}`);
      setImages(images.filter((image) => image.public_id !== public_id));
    }

    setIsDeletingImage(null);
  };

  const removeNewImage = (index) => {
    const updatedNewImages = [...newImages];
    updatedNewImages.splice(index, 1);
    setNewImages(updatedNewImages);
  };

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Product Name"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          handleInputChange(event, existingTitle);
        }}
      />
      <label>Category</label>
      <select
        value={category}
        onChange={(event) => {
          setCategory(event.target.value);
          handleInputChange(event, assignCategory);
        }}
      >
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      {isLoad ? (
        <ProductLoader />
      ) : (
        <>
          {propertiesToFill.length > 0 &&
            propertiesToFill.map((p) => (
              <div key={p.name}>
                <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                <div>
                  <select
                    value={productProperties[p.name]}
                    onChange={(event) => {
                      setProductProp(p.name, event.target.value);
                      handleInputChange(event, assignProperties?.[p.name]);
                    }}
                  >
                    <option value="">Select</option>
                    {p.values.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
        </>
      )}
      <label>Images</label>

      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          className=" cursor-grab flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link._id}
                className={`h-24 bg-white p-2 shadow-sm rounded-sm border border-gray-200 relative ${
                  isDeletingImage === link.public_id && " opacity-50 "
                }`}
              >
                <Image
                  src={link?.url}
                  className="rounded-lg w-full h-full"
                  alt="Image"
                  width={100}
                  height={100}
                />
                {isDeletingImage === link.public_id ? (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Spinner />
                  </div>
                ) : (
                  <button
                    onClick={() => deleteImageProduct(link.public_id)}
                    className="absolute top-0 right-0 p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 bg-white rounded-full"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
        </ReactSortable>
        <ReactSortable
          className=" cursor-grab flex flex-wrap gap-1 "
          list={newImages}
          setList={updateNewImagesOrder}
        >
          {!!newImages.length &&
            newImages.map((item, index) => (
              <div
                key={`${item.name}-${item.size}`}
                className={`h-24 bg-white p-2 shadow-sm rounded-sm border border-gray-200 relative ${
                  isUploading && "opacity-70"
                }`}
              >
                <Image
                  src={URL.createObjectURL(item)}
                  className="rounded-lg w-full h-full"
                  alt="Image"
                  width={100}
                  height={100}
                />
                {console.log({ item })}
                {isUploading && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                    <Spinner />
                  </div>
                )}
                <button
                  onClick={() => removeNewImage(index)}
                  className="absolute top-0 right-0 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 bg-white rounded-full"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            ))}
        </ReactSortable>

        <label className="h-24 w-24 text-sm cursor-pointer bg-white shadow-sm border border-gray-200 text-gray-500 flex flex-col items-center justify-center gap-1 rounded-sm">
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Add image
          <input
            type="file"
            className="hidden"
            multiple
            ref={fileInputRef}
            key={newImages.length}
            onChange={(event) => {
              const newFiles = event.target.files;

              const uniqueNewFiles = Array.from(newFiles).filter((file) => {
                return !newImages.some(
                  (existingFile) => existingFile.name === file.name
                );
              });

              setNewImages([...newImages, ...uniqueNewFiles]);
              handleInputChange(event, existingImages);

              fileInputRef.current.value = null;
            }}
          />
        </label>
      </div>

      <label>Product description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          handleInputChange(event, existingDescription);
        }}
      ></textarea>
      <label>Price</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(event) => {
          setPrice(event.target.value);
          handleInputChange(event, existingPrice);
        }}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(event) => {
          setQuantity(event.target.value);
          handleInputChange(event, existingQuantity);
        }}
      />
      <div className="flex gap-2 justify-end">
        {editedProduct && (
          <button
            type="button"
            onClick={() => isCanceled()}
            className="btn-default"
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
