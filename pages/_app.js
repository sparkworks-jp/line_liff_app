// pages/_app.js
import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import Layout from "../components/Layout";
import { CartProvider } from "../context/CartContext";
import { MessageProvider } from "../context/MessageContext";
import { AuthProvider } from "../context/AuthContext";
import { theme } from '../styles/theme.js'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [loading, setLoading] = useState(true);
  // token 验证和刷新逻辑，调试API临时注释掉

  useEffect(() => {
    // LIFF初期化

    const initializeLiff = async () => {
      try {
        console.log('LIFF初期化開始');
        if (!process.env.NEXT_PUBLIC_LIFF_ID) {
          throw new Error('LIFF IDが設定されていません');
        }

        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID,
          withLoginOnExternalBrowser: true
        });

        console.log('LIFF初期化完了');
        setLiffObject(liff);

        // 未ログインの場合はログインページへ
        if (!liff.isLoggedIn()) {
          console.log('未ログイン状態を検出、ログインページへ遷移します');
          liff.login();
          return;
        }
      } catch (error) {
        console.error('LIFF初期化エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeLiff();
  }, []);

  // LIFF初期化中は読み込み画面を表示
  if (loading) {
    return <div>アプリ初期化中...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider liff={liffObject}>
        <CartProvider>
          <MessageProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MessageProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>

  );
}

export default MyApp;