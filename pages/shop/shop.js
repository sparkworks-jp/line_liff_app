import { useState } from 'react';
import ProductList from '../manage/ProductList';
import styles from '../../styles/Shop.module.css';

const coffeeProducts = [
  { id: 1, name: 'Espresso', price: 250, image: '/espresso.jpg', isNew: true },
  { id: 2, name: 'Latte', price: 340, image: '/latte.jpg', isNew: false },
  { id: 3, name: 'Cappuccino', price: 340, image: '/cappuccino.jpg', isNew: false },
];

export default function Shop() {
  const [products] = useState(coffeeProducts);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Coffee Menu</h1>
      <ProductList products={products} />
    </div>
  );
}

// export default function Shop() {
//   return <div>This is the shop page</div>;
// }