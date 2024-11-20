import React, { useEffect, useState } from 'react';
import { Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth  } from '../context/AuthContext';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const { fetchWithToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/orders/`);
        if (response.status !== 200) throw new Error("Failed to fetch orders");
        console.log("response.data",response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [fetchWithToken]);
  const handleOrderClick = (orderId) => {
    router.push(`/orderhistory/${orderId}`);
  };


  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        注文履歴
      </Typography>
      <List>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <ListItem
              alignItems="flex-start"
              onClick={() => handleOrderClick(order.id)}
            >
              <ListItemText
                primary={`注文日: ${order.date}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {order.items}
                    </Typography>
                    {` — 合計: ${order.total}`}
                  </>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}