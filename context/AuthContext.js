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
        try {
          const tokenParts = currentToken.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp * 1000;
          
          if (Date.now() >= exp) {
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
          console.log('获取到新token',currentToken);
          setIdToken(currentToken);  // 异步更新state
        } catch (error) {
          console.error('获取新token失败:', error);
          throw error;
        }
      }
  
      console.log('使用token发送请求...');
      // 使用最新的token发送请求
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${currentToken}`  
        }
      });
      console.log('response ',response);

      // if (response.status === 401) {
      //   console.log('收到401，尝试最后一次获取新token...');
      //   try {
      //     currentToken = await liff.getIDToken();
      //     console.log('最后一次获取新token成功',currentToken);
      //     setIdToken(currentToken);
  
      //     const retryResponse = await fetch(url, {
      //       ...options,
      //       headers: {
      //         ...options.headers,
      //         'Authorization': `Bearer ${currentToken}`
      //       }
      //     });
  
      //     if (!retryResponse.ok) {
      //       throw new Error(`API错误: ${retryResponse.status}`);
      //     }
      //     return retryResponse.json();
      //   } catch (error) {
      //     console.error('重试获取token失败:', error);
      //     throw error;
      //   }
      // }
  
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