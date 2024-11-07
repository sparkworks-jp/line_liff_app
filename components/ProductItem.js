import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Badge, Box, IconButton } from '@mui/material';
import { useCart } from './CartContext';
import Link from 'next/link';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ProductItem = ({ product }) => {
  const { addToCart, updateCartItem,cart ,removeFromCart} = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState(quantityInCart || 0);

  const handleUpdateQuantity = (change) => {
    const newQuantity = Math.max(0, quantity + change);
    setQuantity(newQuantity);

    const productToUpdate = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: newQuantity
    };
    if (newQuantity === 0) {
      removeFromCart(product.id);
    } else if (newQuantity === 1 && !quantityInCart) {
      addToCart(productToUpdate);
    } else {
      updateCartItem(product.id, newQuantity);
    }
  };

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
              height="150"
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
          <CardContent sx={{ padding: '10px 20px 4px !important' }}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{
                // minHeight: '3em', 
                lineHeight: '1.5em',
                overflow: 'hidden',
                fontSize: '0.95rem',
              }}
            >
              {product.name}
            </Typography>
            <Typography
              variant="body2" color="text.secondary"
              sx={{
                lineHeight: '1em',
                overflow: 'hidden',
                marginBottom: '0',
                fontSize: '0.95rem'
              }}
            >
              ¥{product.price}
            </Typography>

            <Grid container justifyContent="center" spacing={2} sx={{ padding: '0px', margin: '0px' }}>
              <Box display="flex" alignItems="center" mt={0.2} mb={1}>
                <IconButton 
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  handleUpdateQuantity(-1);
                }} size="small">
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1" sx={{ mx: 2 }}>{quantity}</Typography>
                <IconButton
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    handleUpdateQuantity(1);
                  }} size="small">
                  <AddIcon />
                </IconButton>
              </Box>
            </Grid>

          </CardContent>
        </Card>
      </Box>
    </Link>
  );
};

export default ProductItem;