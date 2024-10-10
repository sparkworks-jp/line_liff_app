

import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import Layout from "../components/Layout";
import { CartProvider } from '../components/CartContext';

function MyApp({ Component, pageProps }) {

  return (
    
      <CartProvider>
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </CartProvider>
   
  
  );
}

export default MyApp;