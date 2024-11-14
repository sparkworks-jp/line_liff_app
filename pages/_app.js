import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import Layout from "../components/Layout";
import { CartProvider } from "../context/CartContext";
import { AddressProvider } from "../context/AddressContext";
import { AuthProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_LIFF_ID) {
      console.error('LIFF IDが設定されていません。');
      return;
    }
    // LIFF の初期化のみを行う
    const initializeLiff = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID,
          withLoginOnExternalBrowser: true,
        });
      } catch (error) {
        console.error("LIFF初期化エラー:", error);
      }
    };
    initializeLiff();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <AddressProvider>
          <Layout userProfile={userProfile} userId={userId}>
            <Component {...pageProps} />
          </Layout>
        </AddressProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
