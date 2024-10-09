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
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from './cartContext';

const CartDrawer = () => {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer 
    anchor="right" 
    open={isCartOpen} 
    onClose={() => setIsCartOpen(false)}     
    PaperProps={{
        sx: { width: '30%', maxWidth: '360px', minWidth: '280px' }
      }}>
       <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>Cart</Typography>
        <List sx={{ flexGrow: 1, overflow: 'auto' }}>

          {cart.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem 
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={item.image} alt={item.name} variant="square" />
                </ListItemAvatar>
                <ListItemText 
                  primary={item.name} 
                  secondary={`$${item.price} x ${item.quantity}`} 
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
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
        <Button variant="contained" color="primary" fullWidth>
          注文
        </Button>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;