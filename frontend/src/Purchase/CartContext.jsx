import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  
  useEffect(() => {
    if(cart?.length) localStorage.setItem('cart', JSON.stringify(cart));
    else localStorage.removeItem('cart');
  }, [cart]);

  const addItemToCart = (product, amount) => {
    if(amount < 1 || amount * 1 > product.quantity) return; 

    const itemIndex = cart.findIndex(item => item._id === product._id);
    if(itemIndex > -1) {
      if(product.buyQuantity * 1 + amount * 1 > product.quantity * 1) return;
      setCart(cart.map((item) => (
        item._id === product._id ? 
          { ...item, buyQuantity: item.buyQuantity * 1 + amount * 1 > item.quantity ? item.quantity /*if prefered could be buyQuantity*/: item.buyQuantity * 1 + amount * 1} : 
          item
      )));
    } else {
      setCart([...cart, { ...product, buyQuantity: amount }]);
    }
  };

  const removeItemFromCart = (product, quantity) => {
    if(!quantity || product.buyQuantity == 1) setCart(cart.filter(item => item._id !== product._id));
    else setCart(cart.map((item) => item._id === product._id ? { ...item, buyQuantity: item.buyQuantity * 1 - 1 } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};