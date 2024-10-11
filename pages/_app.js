import "../styles/globals.css";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import Layout from "../components/Layout";
import { CartProvider } from '../components/CartContext';

function MyApp({ Component, pageProps }) {
  const [liffObject, setLiffObject] = useState(null);
  const [liffError, setLiffError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);


  // Execute liff.init() when the app is initialized
//   useEffect(() => {
//     console.log("start liff.init()...");
//     liff
//       .init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID})
//       .then(() => {    
//         console.log("liff.init() done");
//         setLiffObject(liff);
//         if (liff.isLoggedIn()) {
//           liff.getProfile().then(profile => {
//             const userId = profile.userId;
//             const displayName = profile.displayName;
//             setUserId(userId);
//             setUserName(displayName);
//             setUserProfile(profile)

//           }).catch(err => console.error('Error getting profile:', err));
//         } else {
//           liff.login();
//         }

//       })
//       .catch((error) => {
//         console.log(`liff.init() failed: ${error}`);
//         if (!process.env.liffId) {
//           console.info(
//             "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
//           );
//         }
//         setLiffError(error.toString());
//       });
//   }, []);

// console.log("user id",userId)
// console.log("user name",userName)
// console.log("user profile",userProfile)


  return (
    
      <CartProvider>
        <Layout userProfile={userProfile} userId={userId}>
        <Component {...pageProps} />
        </Layout>
      </CartProvider>
   
  
  );
}

export default MyApp;