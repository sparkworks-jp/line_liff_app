import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import ProductPage from '../../components/Product';
import { getProductById } from '../../data/coffeeProducts';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      console.log('Fetched product id:', id);  // 打印获取的商品ID
      const fetchedProduct = getProductById(id);
      console.log('Fetched product:', fetchedProduct);  // 打印获取的商品
      setProduct(fetchedProduct);
    }
  }, [id]);

  if (!router.isReady || !product) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <ProductPage product={product} />;
}