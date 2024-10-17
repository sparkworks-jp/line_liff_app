import { useState } from 'react';
import ProductList from '../components/ProductList';
import styles from '../styles/Shop.module.css';
import { coffeeProducts } from '../data/coffeeProducts';


export default function Shop() {
  const [products] = useState(coffeeProducts);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Coffee Menu</h1>
      <ProductList products={products} />
    </div>
  );
}
