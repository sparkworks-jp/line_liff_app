import { useContext } from 'react';
import { CartContext } from '../shoppingCart/cartContext';
import styles from '../../styles/ProductItem.module.css';

const ProductItem = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className={styles.productItem}>
      {product.isNew && <span className={styles.newBadge}>NEW</span>}
      <img src={product.image} alt={product.name} className={styles.productImage} />
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productPrice}>¥{product.price}</p>
      </div>
      <button onClick={() => addToCart(product)} className={styles.addButton}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductItem;