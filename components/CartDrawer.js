import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from './CartContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } = useCart();

  console.log('Current cart state:', cart);  // 输出当前购物车状态

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleQuantityChange = (itemId, change) => {
    const item = cart.find(i => i.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(itemId, newQuantity);
    }
  };


  const handlePlaceOrder = async () => {
    const User = localStorage.getItem("user");

    const userId = User.userId;  // 从你的用户信息获取用户ID
    const orderData = {
      userId: userId,
      cart: cart,
      total: total,
    };

    try {
      // 发送 POST 请求到 AWS Lambda
      const response = await axios.post('https://your-api-gateway-url.amazonaws.com/prod/order', orderData);
      console.log("Order placed successfully:", response.data);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  return (

    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      PaperProps={{
        sx: { width: '30%', maxWidth: '360px', minWidth: '280px' }
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>Cart</Typography>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>
          {cart.map((item) => (

            <React.Fragment key={item.id}>
              <ListItem
                alignItems="center"
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <ListItemAvatar>
                    <Avatar src={item.image} alt={item.name} variant="square" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.primary">
                          ${item.price} x {item.quantity}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {item.flavorOptions && Object.entries(item.flavorOptions).map(([key, value]) =>
                            value && <Chip key={key} label={key} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                          )}
                        </Box>
                      </React.Fragment>
                    }
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton size="small" onClick={() => handleQuantityChange(item.id, -1)}>
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" sx={{ mx: 1 }}>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => handleQuantityChange(item.id, 1)}>
                    <AddIcon fontSize="small" />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)} sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" align="right">
            Total: ${total.toFixed(2)}
          </Typography>
        </Box>
        <Button variant="contained" color="primary" fullWidth onClick={handlePlaceOrder}>
          注文
        </Button>
      </Box>
    </Drawer>

  );
};

export default CartDrawer;