import axios from "axios";
import { useEffect, useState } from "react";
import ProductLoader from "./Loader/ProductLoader";
import { subHours } from "date-fns";

const HomeStats = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="my-4">
        <ProductLoader />
      </div>
    );
  }

  const ordersToday = orders.filter(
    (order) => new Date(order.createdAt) > subHours(new Date(), 24)
  );
  const ordersWeek = orders.filter(
    (order) => new Date(order.createdAt) > subHours(new Date(), 24 * 7)
  );
  const ordersMonth = orders.filter(
    (order) => new Date(order.createdAt) > subHours(new Date(), 24 * 30)
  );

  const ordersTotal = (orders) => {
    let sum = 0;
    orders.forEach((order) => {
      const { line_items } = order;
      line_items.forEach((line) => {
        const lineSummary = (line.quantity * line.price_data.unit_amount) / 100;
        sum += lineSummary;
      });
    });
    return new Intl.NumberFormat("en-PH").format(sum);
  };

  return (
    <div>
      <h2 className="tile-title">Orders</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Today</h3>
          <div className="tile-number">{ordersToday.length}</div>
          <div className="tile-desc">{ordersToday.length} orders today</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This week</h3>
          <div className="tile-number">{ordersWeek.length}</div>
          <div className="tile-desc">{ordersToday.length} orders this week</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This month</h3>
          <div className="tile-number">{ordersMonth.length}</div>
          <div className="tile-desc">
            {ordersToday.length} orders this month
          </div>
        </div>
      </div>
      <h2 className="tile-title">Revenue</h2>
      <div className="tiles-grid">
        <div className="tile">
          <h3 className="tile-header">Today</h3>
          <div className="tile-number">₱{ordersTotal(ordersToday)}</div>
          <div className="tile-desc">{ordersToday.length} orders today</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This week</h3>
          <div className="tile-number">₱{ordersTotal(ordersWeek)}</div>
          <div className="tile-desc">{ordersWeek.length} orders this week</div>
        </div>
        <div className="tile">
          <h3 className="tile-header">This month</h3>
          <div className="tile-number">₱{ordersTotal(ordersMonth)}</div>
          <div className="tile-desc">
            {ordersMonth.length} orders this month
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeStats;
