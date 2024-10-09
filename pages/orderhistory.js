import React from 'react';
import { Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';

// 模拟订单数据
const orders = [
  { id: 1, date: '2023-05-01', items: 'コーヒー x2, サンドイッチ x1', total: '¥1,500' },
  { id: 2, date: '2023-04-28', items: 'ケーキ x1, 紅茶 x1', total: '¥1,200' },
  { id: 3, date: '2023-04-25', items: 'パスタ x1, サラダ x1', total: '¥1,800' },
];

export default function OrderHistoryPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        注文履歴
      </Typography>
      <List>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <ListItem alignItems="flex-start">
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