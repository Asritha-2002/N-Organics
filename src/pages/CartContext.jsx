import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${BASE_URL}/cart/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    

    const json = await res.json();
    if (json.success) {
      setCartCount(json.count);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);