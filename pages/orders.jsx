import Layout from "@/components/Layout";
import ProductLoader from "@/components/Loader/ProductLoader";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <Layout>
      <h1>Orders</h1>
      <div
        className={`${
          orders.length > 5 && " lg:max-h-[500px] "
        } overflow-y-auto overflow-x-auto `}
      >
        <table className="basic">
          <thead>
            <tr>
              <th>Date</th>
              <th>Paid</th>
              <th>Recipient</th>
              <th>Products</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody className=" divide-y-2 ">
            {isLoading ? (
              <tr>
                <td colSpan={5}>
                  <ProductLoader />
                </td>
              </tr>
            ) : (
              <>
                {orders.length > 0 &&
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td
                        className={
                          order.paid ? "text-green-600" : "text-red-600"
                        }
                      >
                        {order.paid ? "YES" : "NO"}
                      </td>
                      <td>
                        {order.name} {order.email} <br />
                        {order.country} {order.province} <br />
                        {order.city} {order.streetBarangay} <br />
                        {order.postalCode} <br />
                      </td>
                      <td>
                        {order.line_items.map((line, index) => (
                          <div key={index}>
                            {line.price_data?.product_data.name}
                          </div>
                        ))}
                      </td>
                      <td>
                        {order.line_items.map((line, index) => (
                          <div key={index}>x{line.quantity}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Orders;
