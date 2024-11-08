import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Button, Typography, Badge, Box, IconButton } from '@mui/material';
import { useCart } from './CartContext';
import Link from 'next/link';
import Grid from '@mui/material/Grid2';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/system';

const ProductItem = ({ product, onClick }) => {
  const { addToCart, updateCartItem, cart, removeFromCart, isCartInitialized } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState(quantityInCart || 0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [randomSymbol, setRandomSymbol] = useState("✨");
  const symbols = ["✨", "🌟", "🥧", "🎂", "🍩", " 🍪", "🍬", "🍡", "🍯", "🥧", "🥠"];

  useEffect(() => {
    if (isCartInitialized) {
      setQuantity(quantityInCart);
    }
  }, [cart, isCartInitialized]);
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

    const randomIndex = Math.floor(Math.random() * symbols.length);
    setRandomSymbol(symbols[randomIndex]);
    setBubbleKey(prevKey => prevKey + 1);
    setBubbleVisible(true);
    setTimeout(() => setBubbleVisible(false), 800);
  };

  return (

    <Box component="a" sx={{ textDecoration: 'none', color: 'inherit', display: 'block' }} onClick={onClick}>
      <Card sx={{
        width: '100%',
        position: 'relative', // 确保徽章可以相对定位
        boxShadow: 3,
        borderRadius: 6,
        overflow: 'visible'// 解决图片浮动问题 
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
          <AnimatePresence>
            {bubbleVisible && (
              <motion.div
                key={bubbleKey}
                initial={{ opacity: 1, x: -10, y: 65, scale: 0.5, rotate: 0 }}
                animate={{ x: 50, y: -100, opacity: 0, scale: 1, rotate: 36 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  position: 'absolute',
                  top: '80%',
                  left: 'calc(50% - 10px)',
                  fontSize: '3rem',
                  color: 'gold',
                  pointerEvents: 'none',
                }}
              >
                {randomSymbol}
              </motion.div>
            )}
          </AnimatePresence>

        </Box>
        <CardContent sx={{ padding: '10px 20px 4px !important' }}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              minHeight: '1.5em', 
              lineHeight: '1.5em',
              overflow: 'hidden',
              fontSize: '0.95rem',
              whiteSpace: 'nowrap',       
              textOverflow: 'ellipsis'
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
              <CustomIconButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpdateQuantity(-1);
                }}
              >
                <RemoveIcon fontSize="small" />
              </CustomIconButton>

              <Typography variant="h6" sx={{ mx: 2, fontFamily: 'Comic Sans MS, cursive', color: '#8b4513' }}>
                {quantity}
              </Typography>

              <CustomIconButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleUpdateQuantity(1);
                }}
              >
                <AddIcon fontSize="small" />
              </CustomIconButton>
            </Box>
          </Grid>

        </CardContent>
      </Card>
    </Box>

  );
};

export default ProductItem;




const CustomIconButton = styled(IconButton)(({ theme }) => ({
  width: '35px',
  height: '35px',
  borderRadius: '60%',
  color: '#d2691e',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  '&:hover': {
    transform: 'scale(1.1)',
  },
  '&:active': {
    boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.3)',
  },
}));