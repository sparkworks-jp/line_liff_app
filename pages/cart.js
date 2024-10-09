import { useContext } from 'react';
import { CartContext } from '../components/cartContext';
import CartItem from './cartItem';
import Link from 'next/link';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <CartItem 
              key={item.id} 
              item={item} 
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          ))}
          <p>Total: ${total.toFixed(2)}</p>
          <Link href="/billing">
            <a>Proceed to Checkout</a>
          </Link>
        </>
      )}
    </div>
  );
}