import ProductItem from './ProductItem';
import styles from '../../styles/ProductList.module.css';

const ProductList = ({ products }) => {
  return (
    <div className={styles.productList}>
      {products.map(product => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;