import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const HandleContext = createContext({});

const HandleContextProvider = ({ children }) => {
  const [editedProduct, setEditedProduct] = useState(false);
  const router = useRouter();

  const handleInputChange = (event, initialValue) => {
    const newValue =
      event.target.tagName === "SELECT"
        ? event.target.value
        : event.target.type === "file"
        ? event.target.files
        : event.target.value;

    if (event.target.tagName === "SELECT") {
      setEditedProduct(newValue !== initialValue);
    } else if (event.target.type === "file") {
      setEditedProduct(true);
    } else {
      setEditedProduct(String(newValue) !== String(initialValue));
    }
  };

  const isCanceled = () => {
    router.back();
    setEditedProduct(false);
  };

  useEffect(() => {
    setEditedProduct(false);
  }, [router.query]);

  return (
    <HandleContext.Provider
      value={{ editedProduct, setEditedProduct, handleInputChange, isCanceled }}
    >
      {children}
    </HandleContext.Provider>
  );
};

export default HandleContextProvider;
