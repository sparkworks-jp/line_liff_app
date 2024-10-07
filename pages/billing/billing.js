import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useRouter } from 'next/router';

export default function Billing({ liff }) {
  const { cart, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!liff) {
      console.error('LIFF is not initialized');
      return;
    }

    try {
      const paymentUrl = `https://your-backend-api.com/create-payment?amount=${total}`;
      await liff.openWindow({ url: paymentUrl, external: true });
      
      // Here you would typically wait for a webhook from your server
      // confirming the payment before clearing the cart
      clearCart();
      router.push('/thank-you');
    } catch (error) {
      console.error('Payment failed', error);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleCheckout}>
        <div>
          <label htmlFor="address">Delivery Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <h2>Order Summary</h2>
          {cart.map(item => (
            <p key={item.id}>{item.name} x {item.quantity}: ${(item.price * item.quantity).toFixed(2)}</p>
          ))}
          <p><strong>Total: ${total.toFixed(2)}</strong></p>
        </div>
        <button type="submit">Pay with LINE Pay</button>
      </form>
    </div>
  );
}