import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      // ==========================================
      // CASE A: USER LOGGED IN — FETCH FROM DATABASE
      // ==========================================
      try {
        const res = await fetch(`${BASE_URL}/cart/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        if (json.success) {
          setCartCount(json.count);
        }
      } catch (error) {
        console.error("Error fetching DB cart count:", error);
      }
    } else {
      // ==========================================
      // CASE B: GUEST USER — CALCULATE FROM CACHE
      // ==========================================
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      
      // Sum up the quantities of all items added by the guest
      const totalCount = guestCart.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartCount(totalCount);
    }
  };

  // Run automatically whenever the application initializes
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