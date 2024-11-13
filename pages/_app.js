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
  useEffect(() => {
    // 環境変数のチェック
    if (!process.env.NEXT_PUBLIC_LIFF_ID) {
      console.error('LIFF IDが設定されていません。.env.localファイルを確認してください。');
      setLiffError('LIFF IDが設定されていません');
      return;
    }

    console.log("LIFF初期化中...");
    console.log("LIFF ID:", process.env.NEXT_PUBLIC_LIFF_ID);

    liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID,
        withLoginOnExternalBrowser: true, // 外部ブラウザでもログインを有効にする
      })
      .then(() => {
        console.log("LIFF初期化が完了しました");
        setLiffObject(liff);
        
        // ログイン状態の確認
        if (liff.isLoggedIn()) {
          return liff.getProfile();
        } else {
          console.log("ユーザーが未ログインです。ログインページへリダイレクトします...");
          liff.login();
        }
      })
      .then((profile) => {
        if (profile) {
          console.log("ユーザー情報を取得しました:", profile);
          setUserProfile(profile);
          setUserId(profile.userId);
          setUserName(profile.displayName);
          
          // ユーザー情報をローカルストレージに保存
          localStorage.setItem("user", JSON.stringify(profile));
          
          // トークン情報の取得とログ
          const accessToken = liff.getAccessToken();
          const idToken = liff.getIDToken();
          console.log("アクセストークン:", accessToken);
          
        }
      })
      .catch((err) => {
        console.error("LIFF初期化に失敗しました:", err);
        setLiffError(err.message);
        if (err.code) {
          console.error(`エラーコード: ${err.code}`);
        }
        if (err.message) {
          console.error(`エラーメッセージ: ${err.message}`);
        }
      });
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
