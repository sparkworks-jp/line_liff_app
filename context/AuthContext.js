import  {  useState, useEffect } from 'react';
export function AuthProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWithToken = async (url, options = {}) => {
    try {
      // トークンの確認と取得
      let currentToken = idToken;
      if (!currentToken) {
        currentToken = await liff.getIDToken();
        console.log('新しいトークンを取得しました:', currentToken);
        setIdToken(currentToken);
      }

      console.log('リクエスト送信中、使用トークン:', currentToken);
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

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('LIFF初期化開始');
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });
        
        if (!liff.isLoggedIn()) {
          console.log('未ログイン状態を検出、ログインページへ遷移します');
          liff.login();
          return;
        }

        const profile = await liff.getProfile();
        const token = await liff.getIDToken();
        console.log('初期化完了、トークン取得:', token);

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

  if (loading || !idToken) {
    return <div>読み込み中...</div>;
  }

  return (
    <AuthContext.Provider value={{
      userProfile,
      fetchWithToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}