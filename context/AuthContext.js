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
  
      // 解析当前token的函数
      const parseToken = (token) => {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1]));
        console.log('Token解析结果:', {
          exp: new Date(payload.exp * 1000).toLocaleString(),
          iat: new Date(payload.iat * 1000).toLocaleString(),
          current: new Date().toLocaleString(),
          isExpired: Date.now() >= payload.exp * 1000,
          timeLeft: Math.round((payload.exp * 1000 - Date.now()) / 1000) + '秒'
        });
        return payload;
      };
  
      if (currentToken) {
        try {
          const payload = parseToken(currentToken);
          if (Date.now() >= payload.exp * 1000) {
            console.log('Token已过期，获取新token');
            needNewToken = true;
          }
        } catch (error) {
          console.error('Token解析错误:', error);
          needNewToken = true;
        }
      }
  
      if (needNewToken) {
        console.log('获取新token...');
        try {
          currentToken = await liff.getIDToken();
          console.log('获取到新token，解析信息：');
          parseToken(currentToken);
          setIdToken(currentToken);
        } catch (error) {
          console.error('获取新token失败:', error);
          throw error;
        }
      }
  
      console.log('使用token发送请求...');
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`
        }
      });
  
      if (response.status === 401) {
        const responseText = await response.text();
        console.log('收到401错误，详细信息:', responseText);
        throw new Error(`认证失败: ${responseText}`);
      }
  
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('请求错误:', error);
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