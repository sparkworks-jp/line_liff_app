import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import Link from 'next/link';
import { useDrag } from "@use-gesture/react"; 
 
export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const bind = useDrag(({ direction: [xDir] }) => {
      if (xDir > 0) {
        console.log("cart Swiped right: Returning to shop");
        router.push("/shop");
      }
    });
  return (
    <div {...bind()}>
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