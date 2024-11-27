import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from 'next/router';

const PaymentComplete = () => {
  const router = useRouter();

  return (
    <Box
      sx={{
        textAlign: 'center',
        padding: '20px',
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'green', marginBottom: '16px' }} />
      <Typography variant="h5" gutterBottom>
        注文支払いが完了しました！
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: '20px' }}>
        ご注文ありがとうございました。
      </Typography>
      <Button variant="contained" color="primary" onClick={() => router.push('/orderhistory')}>
        注文履歴へ
      </Button>
    </Box>
  );
};

export default PaymentComplete;
