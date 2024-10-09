// import { useContext } from 'react';
// import { CartContext } from './cartContext';
// import styles from '../styles/ProductItem.module.css';

// const ProductItem = ({ product }) => {
//   const { addToCart } = useContext(CartContext);

//   return (
//     <div className={styles.productItem}>
//       {product.isNew && <span className={styles.newBadge}>NEW</span>}
//       <img src={product.image} alt={product.name} className={styles.productImage} />
//       <div className={styles.productInfo}>
//         <h3 className={styles.productName}>{product.name}</h3>
//         <p className={styles.productPrice}>¥{product.price}</p>
//       </div>
//       <button onClick={() => addToCart(product)} className={styles.addButton}>
//         Add to Cart
//       </button>
//     </div>
//   );
// };

// export default ProductItem;
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useCart } from './cartContext';

const ProductItem = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ¥{product.price}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => addToCart(product)}
          sx={{ mt: 2 }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductItem;