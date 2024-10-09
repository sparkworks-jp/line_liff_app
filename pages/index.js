
import Head from "next/head";
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home({ userProfile }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Shop</title>
      </Head>
      <div className={styles.home}>
        <h1 className={styles.title}>スパークタイムズカフェへようこそ</h1>
        {userProfile && <p style={{color: 'white'}}>Hello, {userProfile.displayName}!</p>}
        <Link href="/shop">
          <a className={styles.button}>注文開始</a>
        </Link>
      </div>
    </div>
  );
}