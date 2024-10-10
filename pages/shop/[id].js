import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ProductPage from '../../components/Product';
import { getProductById } from '../../data/coffeeProducts';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchedProduct = getProductById(id);
      setProduct(fetchedProduct);
    }
  }, [id]);

  if (!router.isReady || !product) return <div>Loading...</div>;

  return <ProductPage product={product} />;
}