
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useCart } from './CartContext';

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