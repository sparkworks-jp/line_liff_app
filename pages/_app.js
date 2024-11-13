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
  // useEffect(() => {
  //   // 環境変数のチェック
  //   if (!process.env.NEXT_PUBLIC_LIFF_ID) {
  //     console.error('LIFF IDが設定されていません。.env.localファイルを確認してください。');
  //     setLiffError('LIFF IDが設定されていません');
  //     return;
  //   }

  //   console.log("LIFF初期化中...");
  //   console.log("LIFF ID:", process.env.NEXT_PUBLIC_LIFF_ID);

  //   liff
  //     .init({
  //       liffId: process.env.NEXT_PUBLIC_LIFF_ID,
  //       withLoginOnExternalBrowser: true, // 外部ブラウザでもログインを有効にする
  //     })
  //     .then(() => {
  //       console.log("LIFF初期化が完了しました");
  //       setLiffObject(liff);
        
  //       // ログイン状態の確認
  //       if (liff.isLoggedIn()) {
  //         return liff.getProfile();
  //       } else {
  //         console.log("ユーザーが未ログインです。ログインページへリダイレクトします...");
  //         liff.login();
  //       }
  //     })
  //     .then((profile) => {
  //       if (profile) {
  //         console.log("ユーザー情報を取得しました:", profile);
  //         setUserProfile(profile);
  //         setUserId(profile.userId);
  //         setUserName(profile.displayName);
          
  //         // ユーザー情報をローカルストレージに保存
  //         localStorage.setItem("user", JSON.stringify(profile));
          
  //         // トークン情報の取得とログ
  //         const accessToken = liff.getAccessToken();
  //         const idToken = liff.getIDToken();
  //         const idToken2 = liff.getIdToken();
  //         const decodedIdToken = liff.getDecodedIDToken();
  //         const decodedIdToken2 = liff.getDecodedIdToken();

  //         console.log("アクセストークン:", accessToken);
  //         console.log("idToken:", idToken);
  //         console.log("idToken2:", idToken2);
  //         console.log("decodedIdToken:", decodedIdToken);
  //         console.log("decodedIdToken2:", decodedIdToken2);

  //       }
  //     })
  //     .catch((err) => {
  //       console.error("LIFF初期化に失敗しました:", err);
  //       setLiffError(err.message);
  //       if (err.code) {
  //         console.error(`エラーコード: ${err.code}`);
  //       }
  //       if (err.message) {
  //         console.error(`エラーメッセージ: ${err.message}`);
  //       }
  //     });
  // }, []);

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

    // 测试 getIDToken
    try {
      const idToken = await liff.getIDToken();
      console.log("IDトークン (getIDToken):", idToken);
      tokenInfo.idToken = idToken;
    } catch (error) {
      console.log("getIDToken エラー:", error.message);
    }

    // 测试 getIdToken
    try {
      const idToken2 = await liff.getIdToken();
      console.log("IDトークン (getIdToken):", idToken2);
      tokenInfo.idToken2 = idToken2;
    } catch (error) {
      console.log("getIdToken エラー:", error.message);
    }

    // 测试 getDecodedIDToken
    try {
      const decodedIdToken = await liff.getDecodedIDToken();
      console.log("デコードされたIDトークン (getDecodedIDToken):", decodedIdToken);
      tokenInfo.decodedIdToken = decodedIdToken;
    } catch (error) {
      console.log("getDecodedIDToken エラー:", error.message);
    }

    // 测试 getDecodedIdToken
    try {
      const decodedIdToken2 = await liff.getDecodedIdToken();
      console.log("デコードされたIDトークン (getDecodedIdToken):", decodedIdToken2);
      tokenInfo.decodedIdToken2 = decodedIdToken2;
    } catch (error) {
      console.log("getDecodedIdToken エラー:", error.message);
    }

    // 打印所有成功获取的 token 信息
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

}


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
