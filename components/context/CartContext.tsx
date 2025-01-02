"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("cartItems")) || []
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    const storedTotalPrice = storedCartItems
      ? storedCartItems.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        )
      : 0;
    console.log(storedTotalPrice);
    const storedTotalQuantities = JSON.parse(
      localStorage.getItem("totalQuantities")
    );

    if (storedCartItems) setCartItems(storedCartItems);
    if (storedTotalPrice) setTotalPrice(storedTotalPrice);
    if (storedTotalQuantities) setTotalQuantities(storedTotalQuantities);
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
    // localStorage.setItem("totalQuantities", JSON.stringify(cartItems.length));
  }, [cartItems, totalPrice]);

  const onAdd = (product, quantity) => {
    const existingProduct = cartItems.find((item) => item._id === product._id);

    if (existingProduct) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }

    setTotalPrice((prevPrice) => prevPrice + Number(product.price) * quantity);
    toast.success(`${quantity} ${product.name} added to the cart.`);
  };

  const onRemove = (product) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== product._id)
    );

    setTotalPrice(
      (prevPrice) => prevPrice - Number(product.price) * product.quantity
    );
  };

  const toggleCartItemQuanitity = (id, action) => {
    const foundProduct = cartItems.find((item) => item._id === id);

    if (action === "inc") {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      setTotalPrice((prevPrice) => prevPrice + Number(foundProduct.price));
    } else if (action === "dec") {
      if (foundProduct.quantity === 1) {
        onRemove(foundProduct);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
        );
        setTotalPrice((prevPrice) => prevPrice - Number(foundProduct.price));
      }
    }
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities: cartItems.length,
        onAdd,
        onRemove,
        toggleCartItemQuanitity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
