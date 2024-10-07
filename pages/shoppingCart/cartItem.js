const CartItem = ({ item, removeFromCart, updateQuantity }) => {
    return (
      <div>
        <h3>{item.name}</h3>
        <p>Price: ${item.price}</p>
        <p>
          Quantity: 
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
          {item.quantity}
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </p>
        <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
        <button onClick={() => removeFromCart(item.id)}>Remove</button>
      </div>
    );
  };
  
  export default CartItem;