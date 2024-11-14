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
      let needNewToken = !currentToken;
  
      if (currentToken) {
        // 检查 token 是否过期
        try {
          const tokenParts = currentToken.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp * 1000; 
          
          if (Date.now() >= exp) {
            console.log('Token已过期获取新token');
            needNewToken = true;
          }
        } catch (error) {
          console.error('Token解析错误:', error);
          needNewToken = true;
        }
      }
  
      // 如果需要，获取新token
      if (needNewToken) {
        console.log('获取新token...');
        currentToken = await liff.getIDToken();
        setIdToken(currentToken);
      }
  
      // 发送请求
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`
        }
      });
  
      if (response.status === 401) {
        // 如果返回401，强制获取新token并重试
        console.log('收到401尝试获取新token...');
        currentToken = await liff.getIDToken();
        setIdToken(currentToken);
        
        // 使用新token重试请求
        const retryResponse = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${currentToken}`
          }
        });
  
        if (!retryResponse.ok) {
          throw new Error(`API error: ${retryResponse.status}`);
        }
        return retryResponse.json();
      }
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('request error:', error);
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