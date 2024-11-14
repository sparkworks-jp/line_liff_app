import { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import styles from '../styles/Shop.module.css';
import { coffeeProducts } from '../data/coffeeProducts';
import axios from 'axios';
import { useAuth  } from '../context/AuthContext';


export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const { fetchWithToken } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const orders = await fetchWithToken(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/shop/products/`);
        // const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/shop/products/`);
        setProducts(response.data);
        console.log(response.data);
        console.log(response);

        setLoading(false); 
      } catch (err) {
        setError('shop info error'); 
        setLoading(false);
      }
    };

    fetchProducts(); 
  }, []); 

  if (loading) {
    return <div>loading...</div>; 
  }

  if (error) {
    return <div>{error}</div>; 
  }



  return (
    <div className={styles.container}>
      <ProductList products={products} />
    </div>
  );
}
