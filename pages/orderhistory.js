import React, { useEffect, useState } from 'react';
import { Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useRouter } from 'next/router';

// 模拟订单数据
const orders = [
  { id: 1, date: '2023-05-01', items: 'コーヒー x2, サンドイッチ x1', total: '¥1,500' },
  { id: 2, date: '2023-04-28', items: 'ケーキ x1, 紅茶 x1', total: '¥1,200' },
  { id: 3, date: '2023-04-25', items: 'パスタ x1, サラダ x1', total: '¥1,800' },
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/orderlist");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        // console.log(response,response.json());
        
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
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
              button
              onClick={() => handleOrderClick(order.id)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
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