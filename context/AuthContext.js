// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children, liff }) {
  const [userProfile, setUserProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // トークンとユーザー情報の初期化
  useEffect(() => {
    const initialize = async () => {
      try {
        if (!liff) return;

        const profile = await liff.getProfile();
        const token = await liff.getIDToken();
        console.log('ユーザー情報とトークンを取得しました');

        setUserProfile(profile);
        setIdToken(token);
      } catch (error) {
        console.error('認証情報取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [liff]);

  const fetchWithToken = async (url, options = {}) => {
    try {
      let currentToken = idToken;
      if (!currentToken) {
        currentToken = await liff.getIDToken();
        setIdToken(currentToken);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('リクエストエラー:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>認証情報読み込み中...</div>;
  }

  return (
    <AuthContext.Provider value={{
      userProfile,
      fetchWithToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}