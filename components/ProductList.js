import { Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import ProductItem from './ProductItem';
import styles from '../styles/ProductList.module.css';

const ProductList = ({ products }) => {
  return (

    <Grid container spacing={{ xs: 2, md: 3,lg: 3 }}>
    {products.map(product => (
      <Grid size={{ xs: 6, sm: 6,md: 4,lg: 4 }} key={product.id}>
        <ProductItem product={product} />
      </Grid>
    ))}
  </Grid>


  );
};

export default ProductList;