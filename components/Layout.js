import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";
import SimpleBottomNavigation from "./Bottombutton";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PAGE_TITLES = {
  '/': 'ホーム',
  '/shop': 'ショップ',
  '/checkout': 'お会計',
  '/addressList': '配送先一覧',
  '/address': '配送先',
  '/address': '配送先登録',
  '/orderhistory': '注文履歴',
};

const Layout = ({ children, userProfile, userId }) => {
  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } =
    useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const router = useRouter();
  const hiddenLayoutPaths = ["/checkout", "/addressList", "/address","/paymentcomplete"];
  const isHidden = hiddenLayoutPaths.includes(router.pathname);

  // 戻るボタンを表示するパスを定義
  const showBackButtonPaths = ["/addressList", "/address", "/checkout"]; // 戻るボタンをこれらのパスでのみ表示
  const showBackButton = showBackButtonPaths.includes(router.pathname);

   // 戻るパスのロジックを定義
   const backPathMap = {
    "/addressList": "/checkout", // addressList --> checkout
    "/address": "/addressList", // address --> addressList
    "/checkout": "/shop", // checkout --> shop
  };



  // 動的に戻るパスを決定
  const handleBack = () => {
    const backPath = backPathMap[router.pathname]; 
    if (backPath) {
      router.push(backPath);
    } else {
      router.back();
    }
  };

  const getCurrentPageTitle = () => {
    return PAGE_TITLES[router.pathname] ; 
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="fixed">
        <Toolbar variant="dense">
          {/* 戻るボタン */}
          {showBackButton && (
            <IconButton edge="start" color="inherit" onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getCurrentPageTitle()}
          </Typography>

          {!isHidden && (
            <>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" align="right">
                  合計:　 {total}　円
                </Typography>
              </Box>
              <IconButton color="inherit" onClick={() => setIsCartOpen(true)}>
                <Badge
                  badgeContent={cart.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  )}
                  color="warning"
                >
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ paddingLeft: 2, marginTop: '56px' }}>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, pb: '56px'}}>
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