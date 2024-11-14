// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import liff from '@line/liff';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // APIリクエスト用の共通関数
  const fetchWithToken = async (url, options = {}) => {
    try {
      // トークンがない場合は再取得
      if (!idToken) {
        const newToken = await liff.getIDToken();
        setIdToken(newToken);
      }

      // リクエストヘッダーにトークンを追加
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!response.ok) {
        throw new Error('APIエラー');
      }

      return response.json();
    } catch (error) {
      console.error('リクエストエラー:', error);
      throw error;
    }
  };

  // LIFF初期化
  useEffect(() => {
    const initialize = async () => {
      try {
        // LIFFログインチェック
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        // ユーザー情報とトークンを取得
        const profile = await liff.getProfile();
        const token = await liff.getIDToken();

        setUserProfile(profile);
        setIdToken(token);

      } catch (error) {
        console.error('初期化エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <AuthContext.Provider value={{
      userProfile,
      fetchWithToken,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);