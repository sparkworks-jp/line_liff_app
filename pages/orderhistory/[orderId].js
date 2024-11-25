import React from 'react';
import { useRouter } from 'next/router';
import {
    Typography,
    Box,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Link as MuiLink,
    Container,
    Button,

} from '@mui/material';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import Grid from '@mui/material/Grid2';

// 模拟订单详细信息
const orderDetails = {
    orderId: 'ORD12345678',
    trackingNumber: 'TRK98765432',
    orderStatus: '01',
    items: [
        { id: 1, name: 'らせん酥（螺旋酥）', quantity: 2, price: 340, image: '/rasensu.jpg' },
        { id: 3, name: 'たんこう酥（蛋黄酥）', quantity: 3, price: 500, image: '/tankōsu.png' },
        { id: 4, name: 'にくまつケーキ（肉松蛋糕）', quantity: 3, price: 500, image: '/nikumatsu.jpg' },
        { id: 5, name: 'エッグタルト（蛋挞）', quantity: 3, price: 500, image: '/eggutarto.jpg' },
        { id: 6, name: 'げっぺい（月饼）', quantity: 3, price: 500, image: '/geppei2.jpg' },
        { id: 7, name: 'ほうり酥（凤梨酥）', quantity: 3, price: 500, image: '/hōrisu.jpg' },
        { id: 8, name: 'りょくとう餅（绿豆饼）', quantity: 3, price: 500, image: '/ryokutō.jpg' },
        { id: 9, name: 'なつめに酥（枣泥酥）', quantity: 3, price: 500, image: '/natsumenisu.jpg' },
        { id: 10, name: 'ゆうご（油果）', quantity: 3, price: 500, image: '/yūgo.jpg' },
        { id: 11, name: 'ブラウニー（布朗尼）', quantity: 3, price: 500, image: '/buraunī.jpg' },
        { id: 12, name: 'マカロン（马卡龙）', quantity: 3, price: 500, image: '/makaron.jpg' },
        { id: 13, name: 'マドレーヌ（玛德琳）', quantity: 3, price: 500, image: '/madorēnu.jpg' },
    ],
    totalAmount: '¥2,970',
    discount: '¥100',
    finalAmount: '¥2,870',
    deliveryFee: '¥1,870',
    orderDate: '2023-05-01',
    estimatedDelivery: '2023-05-05',
    postalCode: '123-4567',
    address: '東京都新宿区西新宿1-1-1',
};


const ORDER_STATUS_MAP = {
    "01": "作成済み",
    "02": "支払い待ち",
    "03": "支払い済み",
    "04": "発送済み",
    "05": "完了",
    "06": "キャンセル",
};

const OrderDetailPage = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const handleBreadcrumbClick = (event) => {
        event.preventDefault();
        router.push('/order-history');
    };
    const shouldShowCancelButton = orderDetails.orderStatus == "01" || orderDetails.orderStatus == "02";
    const orderStatusText = ORDER_STATUS_MAP[orderDetails.orderStatus] || "不明なステータス";
    
    const cancelOrder = async (order_id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/order/${order_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: "06" })
            });
            if (!response.ok) throw new Error("注文キャンセルに失敗しました");
            alert("注文がキャンセルされました");
        } catch (error) {
            console.error("Error canceling order:", error);
        }
    };
    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                注文詳細
            </Typography>
            {/* 订单状态和信息 */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="text.secondary">
                    注文番号　: {orderId}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    注文状況　: {orderStatusText}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    追跡番号　: {orderDetails.trackingNumber}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    注文日　　: {orderDetails.orderDate}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    予想配達日: {orderDetails.estimatedDelivery}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    郵便番号　: {orderDetails.postalCode}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    住所　　　: {orderDetails.address}
                </Typography>
            </Box>

            {shouldShowCancelButton && (
                <Stack direction="row" spacing={2}>
                    <Button size="small" 
                    variant="outlined" 
                    color="warning" 
                    startIcon={<DeleteIcon />} 
                    onClick={() => cancelOrder(order_id)}
                    >
                        注文キャンセル
                    </Button>
                    <Button size="small" 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<HourglassTopRoundedIcon />} 
                    //TODO 
                    >
                        お支払い待ち
                    </Button>
                </Stack>
            )}

                    
            {/* 商品列表 */}
            <List>
                {orderDetails.items.map((item) => (
                    <React.Fragment key={item.id}>
                        <ListItem alignItems="center">
                            <ListItemAvatar>
                                <Avatar src={item.image} alt={item.name} variant="square" />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.name}
                                secondary={`数量: ${item.quantity} - 単価: ¥${item.price}`}
                            />
                        </ListItem>
                        <Divider component="li" />
                    </React.Fragment>
                ))}
            </List>

            {/* 支付信息 */}
            <Box sx={{ mt: 2 }}>
                {/* 割引金額行 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        割引金額:
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {orderDetails.discount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        配送料:
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {orderDetails.deliveryFee}
                    </Typography>
                </Box>

                {/* 合計支払金額行 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        合計支払金額:
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{
                            color: 'orange',
                            fontWeight: 'bold',
                            fontSize: '2rem',
                        }}
                    >
                        {orderDetails.finalAmount}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default OrderDetailPage;
