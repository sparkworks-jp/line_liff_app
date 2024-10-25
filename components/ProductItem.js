import React from 'react';
import { Card, CardContent, CardMedia, Typography, Badge, Box } from '@mui/material';
import { useCart } from './CartContext';
import Link from 'next/link';

const ProductItem = ({ product }) => {
  const { addToCart } = useCart();
  const { cart } = useCart();

  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  return (
   
    <Link href={`/shop/${product.id}`} passHref>
    <Box component="a" sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <Card sx={{ 
        width: '100%', 
        position: 'relative', // 确保徽章可以相对定位
        boxShadow: 3, 
        borderRadius: 6, 
        overflow: 'visible' // 解决图片浮动问题
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="180"
            image={product.image}
            alt={product.name}
            sx={{ borderRadius: '18px 18px 0 0', overflow: 'hidden' }}
          />
          <Badge
            badgeContent={quantityInCart}
            color="warning"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              zIndex: 2, // 确保徽章在图片之上
            }}
          />
        </Box>
        <CardContent>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="div"
          sx={{
            minHeight: '3em', 
            lineHeight: '1.5em', 
            overflow: 'hidden',
            whiteSpace: 'normal' 
          }}
        >
          {product.name}
        </Typography>
          <Typography variant="body2" color="text.secondary">
            ¥{product.price}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  </Link>
    );
};

export default ProductItem;