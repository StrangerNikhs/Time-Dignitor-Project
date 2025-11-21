import React, { useEffect, useState } from "react";
import { getStats } from "../api/product.api";

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getStats();
        setStats(data);
      } catch (e) {}
    })();
  }, []);

  if (!stats) return null;
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Analytics</h3>
      <div>Total Products: {stats.summary?.totalProducts}</div>
      <div>
        Avg Price:{" "}
        {stats.summary?.avgPrice?.toFixed
          ? stats.summary.avgPrice.toFixed(2)
          : stats.summary.avgPrice}
      </div>
      <div>
        Highest Priced:{" "}
        {stats.highest
          ? stats.highest.name + " - " + stats.highest.price
          : "N/A"}
      </div>
      <h4>By Category</h4>
      <ul>
        {stats.perCategory.map((c) => (
          <li key={c._id}>
            {c._id}: {c.count} (avg ₹{c.avgPrice?.toFixed(2)})
          </li>
        ))}
      </ul>
    </div>
  );
}
