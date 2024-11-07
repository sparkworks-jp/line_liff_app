import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import {
  Card,
  CardContent,
  CardMedia,
  Typography
} from '@mui/material';

const Product = ({ product }) => {
  const [flavorOptions, setFlavorOptions] = useState({
    extraShot: false,
    whippedCream: false,
    syrup: false,
  });

  const handleFlavorChange = (event) => {
    setFlavorOptions({
      ...flavorOptions,
      [event.target.name]: event.target.checked,
    });
  };


  return (
    <Card sx={{
      maxWidth: 600,
      margin: 'auto',
      mt: 3,
      boxShadow: 3,
      border: '1px solid #e0e0e0',
    }}>
      <CardMedia
        component="img"
        height="300"
        image={product.image}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          {product.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          ¥{product.price}
        </Typography>
        <Grid container spacing={1}>
          {product.des_images && product.des_images.map((imgSrc, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CardMedia
                component="img"
                image={imgSrc}
                alt={`Product image ${index + 1}`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {product.description}
        </Typography>
        {/* <Box mt={2} mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Flavor Options:
          </Typography>
          <FormGroup>
          <Grid container spacing={0.5}>
              <Grid item size={{ xs: 4, sm: 4,md: 4,lg: 4 }}>
                <FormControlLabel
                  control={<Checkbox checked={flavorOptions.extraShot} onChange={handleFlavorChange} name="extraShot" />}
                  label="Extra Shot"
                />
              </Grid>
              <Grid item size={{ xs: 4, sm: 4,md: 4,lg: 4 }}>
                <FormControlLabel
                  control={<Checkbox checked={flavorOptions.whippedCream} onChange={handleFlavorChange} name="whippedCream" />}
                  label="Whipped Cream"
                />
              </Grid>
              <Grid item size={{ xs: 4, sm: 4,md: 4,lg: 4 }}>
                <FormControlLabel
                  control={<Checkbox checked={flavorOptions.syrup} onChange={handleFlavorChange} name="syrup" />}
                  label="Flavor Syrup"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </Box> */}

        <Grid container justifyContent="center" spacing={2}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            アレルギー情報：{product.allergens}
          </Typography>
        </Grid>
      </CardContent>

    </Card>
  );
};

export default Product;