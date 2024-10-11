
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge,Box} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from './CartContext';
import CartDrawer from './CartDrawer';
import SimpleBottomNavigation from './Bottombutton';
import Breadcrumb from './Breadcrumb';
 
const Layout = ({ children,userProfile,userId }) => {
  const { cart, setIsCartOpen } = useCart();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Shop          {userId && <p>欢迎，{userId}</p>}

          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {userId && <p>欢迎，{userId}</p>}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {userProfile && <p>欢迎，{userProfile.displayName}</p>}
          </Typography>
          <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
            <Badge badgeContent={cart.reduce((sum, item) => sum + item.quantity, 0)} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ marginTop: '8px' }}>
        <Breadcrumb />
      </Box>
      <Box component="main" sx={{ flexGrow: 1 , pb: '30px' }}>
        {children}
      </Box>
      <CartDrawer />
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <SimpleBottomNavigation />
      </Box>
    </Box>
  );
};

export default Layout;