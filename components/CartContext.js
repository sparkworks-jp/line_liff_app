import React, { createContext, useState, useContext, useEffect } from 'react';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);


const CART_KEY = 'cart';
const CART_EXPIRATION_KEY = 'cartExpiration';
// 現在のタイムスタンプを取得する関数
const getCurrentTimestamp = () => new Date().getTime();

// カートの有効期限が切れているかをチェックする関数
const isCartExpired = () => {
  const expiration = localStorage.getItem(CART_EXPIRATION_KEY);
  if (!expiration) return true;
  return getCurrentTimestamp() > parseInt(expiration, 10);
};

// カートを保存し、有効期限を設定する関数
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  localStorage.setItem(CART_EXPIRATION_KEY, getCurrentTimestamp() + process.env.NEXT_PUBLIC_ORDER_EXPIRATION_TIME);
};

// localStorage からカートを読み込む関数（期限切れの場合は削除）
const loadCartFromLocalStorage = () => {
  if (isCartExpired()) {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(CART_EXPIRATION_KEY);
    return [];
  }
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartInitialized, setIsCartInitialized] = useState(false);

  // 初期化時に localStorage からカートを読み込む
  useEffect(() => {
    // 检查是否处于浏览器环境，确保只在客户端执行
    if (typeof window !== 'undefined') {
      const initialCart = loadCartFromLocalStorage();
      setCart(initialCart);
      setIsCartInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && cart.length > 0) {
      saveCartToLocalStorage(cart);
    }
  }, [cart]);

  const addToCart = (product) => {
    console.log('Adding to cart:', product); 
    setCart(prevCart => {
      console.log('Previous cart state:', prevCart);  

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
        console.log('Updated cart:', newCart);  

        return newCart;
      } else {
        console.log('Adding new item to cart', product);

        return [...prevCart, product];
      }
    });
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
  const updateCartItem = (productId, quantity) => {
    setCart((prevCart) => {
      if (quantity === 0) {
        return prevCart.filter(item => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      updateCartItem,
      isCartOpen, 
      setIsCartOpen,
      isCartInitialized  
    }}>
      {children}
    </CartContext.Provider>
  );
};

