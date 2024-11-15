
import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import ProductItem from './ProductItem';
import ProductDetailDialog from './ProductDetailDialog';

const ProductList = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };
  return (
    <Grid container spacing={{ xs: 2, md: 3,lg: 3 }}>
      {products.map(product => (
        <Grid  size={{ xs: 6, sm: 6,md: 4,lg: 4 }} key={product.product_id}>
          <ProductItem product={product} onClick={() => handleProductClick(product)}/>
        </Grid>
      ))}
      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={isDialogOpen}
          onClose={handleCloseDialog}
        />
      )}
    </Grid>
  );
};

export default ProductList;
