import React, { createContext, useState, useContext } from 'react';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    console.log('Adding to cart:', product); // 添加的商品信息
    setCart(prevCart => {
      console.log('Previous cart state:', prevCart);  // 之前购物车的状态

      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
        const newCart = [...prevCart];
        console.log('Item already in cart, updating...', product);

        newCart[existingItemIndex] = {
          ...newCart[existingItemIndex],
          // quantity: product.quantity,
          quantity: newCart[existingItemIndex].quantity + product.quantity, 
          flavorOptions: product.flavorOptions
        };
        console.log('Updated cart:', newCart);  // 打印更新后的购物车

        return newCart;
      } else {
        console.log('Adding new item to cart', product);

        return [...prevCart, product];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

