// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);



const clearLiffCache = (liffId) => {
  console.log('检查并清除过期的LIFF缓存...');
  
  // 获取所有LIFF相关的localStorage key
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

  // 检查token是否过期
  const decodedTokenKey = `${keyPrefix}decodedIDToken`;
  const decodedTokenStr = localStorage.getItem(decodedTokenKey);
  
  if (decodedTokenStr) {
    try {
      const decodedToken = JSON.parse(decodedTokenStr);
      const isExpired = new Date().getTime() > decodedToken.exp * 1000;
      
      console.log('Token信息:', {
        exp: new Date(decodedToken.exp * 1000).toLocaleString(),
        now: new Date().toLocaleString(),
        isExpired: isExpired
      });

      if (isExpired) {
        console.log('发现过期token，清除LIFF缓存...');
        const keys = getLiffKeys();
        keys.forEach(key => {
          console.log('清除:', key);
          localStorage.removeItem(key);
        });
      }
    } catch (error) {
      console.error('解析缓存token失败，清除所有LIFF缓存:', error);
      getLiffKeys().forEach(key => localStorage.removeItem(key));
    }
  }
};


export function AuthProvider({ children, liff }) {
  const [userProfile, setUserProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // トークンとユーザー情報の初期化
  useEffect(() => {
    const initialize = async () => {
      try {
        if (!liff) return;
        // 检查并清除过期的LIFF缓存
        clearLiffCache(process.env.NEXT_PUBLIC_LIFF_ID);
        // 初始化LIFF
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID,
          withLoginOnExternalBrowser: true
        });

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
        try {
          const tokenParts = currentToken.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp * 1000;
          
          if (Date.now() >= exp) {
            console.log('Token已过期，清除缓存并获取新token');
            clearLiffCache(process.env.NEXT_PUBLIC_LIFF_ID);
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
          console.log('获取到新token');
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