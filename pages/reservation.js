import React from 'react';
import { Typography, Container, Grid, TextField, Button } from '@mui/material';

export default function ReservationPage() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        予約
      </Typography>
      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="お名前" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="日付" type="date" InputLabelProps={{ shrink: true }} variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="時間" type="time" InputLabelProps={{ shrink: true }} variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary">
              予約する
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}