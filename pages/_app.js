import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import Layout from "../components/Layout";
import { CartProvider } from "../context/CartContext";
import { AddressProvider } from "../context/AddressContext";

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  // Execute liff.init() when the app is initialized
  const getTokenInfo = async () => {
    const tokenInfo = {};

    // 测试 getAccessToken
    try {
      const accessToken = await liff.getAccessToken();
      console.log("アクセストークン:", accessToken);
      tokenInfo.accessToken = accessToken;
    } catch (error) {
      console.log("getAccessToken エラー:", error.message);
    }

    try {
      const idToken = await liff.getIDToken();
      console.log("IDトークン (getIDToken):", idToken);
      tokenInfo.idToken = idToken;
    } catch (error) {
      console.log("getIDToken エラー:", error.message);
    }



    try {
      const decodedIdToken = await liff.getDecodedIDToken();
      console.log("デコードされたIDトークン (getDecodedIDToken):", decodedIdToken);
      tokenInfo.decodedIdToken = decodedIdToken;
    } catch (error) {
      console.log("getDecodedIDToken エラー:", error.message);
    }



    console.log("取得できたすべてのトークン情報:", tokenInfo);
    return tokenInfo;
  };

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_LIFF_ID) {
      console.error('LIFF IDが設定されていません。');
      setLiffError('LIFF IDが設定されていません');
      return;
    }

    const initializeLiff = async () => {
      try {
        console.log("LIFF初期化中...");
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID,
          withLoginOnExternalBrowser: true,
        });
        
        console.log("LIFF初期化完了");
        setLiffObject(liff);

        if (!liff.isLoggedIn()) {
          console.log("未ログイン状態を検出。ログインページへ移動します...");
          liff.login();
          return;
        }

        // 获取用户信息
        try {
          const profile = await liff.getProfile();
          console.log("ユーザー情報:", profile);
          setUserProfile(profile);
          setUserId(profile.userId);
          setUserName(profile.displayName);
          localStorage.setItem("user", JSON.stringify(profile));

          // 获取所有 token 信息
          const tokenInfo = await getTokenInfo();
          setTokens(tokenInfo);

        } catch (profileError) {
          console.error("プロフィール取得エラー:", profileError);
        }

      } catch (initError) {
        console.error("LIFF初期化エラー:", initError);
        setLiffError(initError.message);
      }
    };

    initializeLiff();
  }, []);




  return (
    <CartProvider>
      <AddressProvider>
      <Layout userProfile={userProfile} userId={userId}>
        <Component {...pageProps} />
      </Layout>
      </AddressProvider>
    </CartProvider>
  );
}

export default MyApp;
