

import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useCart } from './CartContext';
import Link from 'next/link';

const ProductItem = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }}>
      <Link href={`/shop/${product.id}`} passHref>
        <CardMedia
          component="img"
          sx={{
            height: 140,
            objectFit: 'cover',
            cursor: 'pointer'

          }}
          image={product.image}
          alt={product.name}
        />
      </Link>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <Link href={`/shop/${product.id}`} passHref>
            <Typography gutterBottom variant="h5" component="div"sx={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
              {product.name}
            </Typography>
          </Link>
          <Typography variant="body2" color="text.secondary">
            ¥{product.price}
          </Typography>
        </div>

      </CardContent>
    </Card>
  );
};

export default ProductItem;