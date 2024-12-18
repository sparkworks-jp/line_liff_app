import { BackupOutlined } from '@mui/icons-material';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// line sdk のトークン有効期限に問題があるため、一時的に手動でリセットします。
const clearLiffCache = (liffId) => {
  console.log('期限切れのLIFFキャッシュを確認してクリアしています...');

  // LIFF関連のlocalStorageキーを取得
  const keyPrefix = `LIFF_STORE:${liffId}:`;
  const getLiffKeys = () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(keyPrefix)) {
        keys.push(key);
      }
    }
    return keys;
  };

  // トークンが期限切れかどうかを確認
  const decodedTokenKey = `${keyPrefix}decodedIDToken`;
  const decodedTokenStr = localStorage.getItem(decodedTokenKey);

  if (decodedTokenStr) {
    try {
      const decodedToken = JSON.parse(decodedTokenStr);
      const isExpired = new Date().getTime() > decodedToken.exp * 1000;

      console.log('トークン情報:', {
        exp: new Date(decodedToken.exp * 1000).toLocaleString(),
        now: new Date().toLocaleString(),
        isExpired: isExpired
      });

      if (isExpired) {
        console.log('期限切れのトークンを検出、LIFFキャッシュをクリアします...');
        const keys = getLiffKeys();
        keys.forEach(key => {
          console.log('削除:', key);
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('キャッシュされたトークンの解析に失敗しました。すべてのLIFFキャッシュをクリアします:', error);
      getLiffKeys().forEach(key => localStorage.removeItem(key));
    }
  }
};

export function AuthProvider({ children, liff }) {
  const [userProfile, setUserProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mockUserType, setMockUserType] = useState('default');

  // トークンとユーザ情報の初期化
  useEffect(() => {
    const initialize = async () => {
      try {
        if (!liff) return;
        // トークン検証とリフレッシュロジック、デバッグAPIは一時的にコメントアウトされています
        // 期限切れのLIFFキャッシュを確認してクリア
        clearLiffCache(process.env.NEXT_PUBLIC_LIFF_ID);
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID,
          withLoginOnExternalBrowser: true
        });

        const profile = await liff.getProfile();
        const token = await liff.getIDToken();
        console.log('ユーザ情報とトークンを取得しました');
        console.log('profile',profile);
        console.log('token',token);
        setUserProfile(profile);
        setIdToken(token);
      } catch (error) {
        console.error('認証情報の取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [liff]);

  
  const fetchWithToken = async (url, options = {}) => {
    try {
      let currentToken = idToken;
      let needNewToken = !currentToken;

      // トークン検証とリフレッシュロジック、デバッグAPIは一時的にコメントアウトされています
      if (currentToken) {
        try {
          const tokenParts = currentToken.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp * 1000;

          if (Date.now() >= exp) {
            console.log('トークンが期限切れです。キャッシュをクリアして新しいトークンを取得します');
            clearLiffCache(process.env.NEXT_PUBLIC_LIFF_ID);
            needNewToken = true;
          }
        } catch (error) {
          console.error('トークンの解析エラー:', error);
          needNewToken = true;
        }
      }

      if (needNewToken) {
        console.log('新しいトークンを取得しています...');
        try {
          currentToken = await liff.getIDToken();
          console.log('新しいトークンを取得しました');
          setIdToken(currentToken);
        } catch (error) {
          console.error('新しいトークンの取得に失敗しました:', error);
          throw error;
        }
      }

      console.log('リクエストを送信しています...');
      const response = await fetch(url,  {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`,
          "ngrok-skip-browser-warning": "true",
        }
      });

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }

      const data = await response.json();
      console.log('APIレスポンス:', data);
      return data;
    } catch (error) {
      console.error('リクエストエラー:', error);
      throw error;
    }
  };

  if (loading) {
    return <div>認証情報を読み込んでいます...</div>;
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
