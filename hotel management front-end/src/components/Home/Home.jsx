import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // eslint-disable-next-line no-debugger
        // debugger;
        const response = await axios.get(
          "http://localhost:3000/api/product/get-all"
        );
        setProducts(response.data);
        setError(""); // Xóa lỗi (nếu có)
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to fetch Products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="wrapper d-flex align-items-stretch">
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && (
        <div className="product-list">
          <h2>Product List</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <h3>{product.title}</h3>
                <p>Price: ${product.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
