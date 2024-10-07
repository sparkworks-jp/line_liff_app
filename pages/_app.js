

import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import Layout from "../components/Layout";
import { CartProvider } from './shoppingCart/cartContext';

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log("start liff.init()...");
    console.log("process.env.NEXT_PUBLIC_LIFF_ID", process.env.NEXT_PUBLIC_LIFF_ID);
    
    liff
      .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
      .then(() => {
        console.log("liff.init() done");
        setLiffObject(liff);
        if (liff.isLoggedIn()) {
          liff.getProfile().then(profile => setUserProfile(profile));
        }
      })
      .catch((error) => {
        console.log(`liff.init() failed: ${error}`);
        setLiffError(error.toString());
      });
  }, []);

  pageProps.liff = liffObject;
  pageProps.liffError = liffError;
  pageProps.userProfile = userProfile;

  return (
    
      <CartProvider>
        <Layout>
        <Component {...pageProps} />
        </Layout>
      </CartProvider>
   
  
  );
}

export default MyApp;