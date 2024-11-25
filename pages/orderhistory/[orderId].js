import React, { useState, useEffect } from 'react';
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
    CircularProgress,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid2';
import { useAuth } from '../../context/AuthContext';

// 模拟订单详细信息
// const orderDetails = {
//     orderId: 'ORD12345678',
//     trackingNumber: 'TRK98765432',
//     orderStatus: '01',
//     items: [
//         { id: 1, name: 'らせん酥（螺旋酥）', quantity: 2, price: 340, image: '/rasensu.jpg' },
//         { id: 3, name: 'たんこう酥（蛋黄酥）', quantity: 3, price: 500, image: '/tankōsu.png' },
//         { id: 4, name: 'にくまつケーキ（肉松蛋糕）', quantity: 3, price: 500, image: '/nikumatsu.jpg' },
//         { id: 5, name: 'エッグタルト（蛋挞）', quantity: 3, price: 500, image: '/eggutarto.jpg' },
//         { id: 6, name: 'げっぺい（月饼）', quantity: 3, price: 500, image: '/geppei2.jpg' },
//         { id: 7, name: 'ほうり酥（凤梨酥）', quantity: 3, price: 500, image: '/hōrisu.jpg' },
//         { id: 8, name: 'りょくとう餅（绿豆饼）', quantity: 3, price: 500, image: '/ryokutō.jpg' },
//         { id: 9, name: 'なつめに酥（枣泥酥）', quantity: 3, price: 500, image: '/natsumenisu.jpg' },
//         { id: 10, name: 'ゆうご（油果）', quantity: 3, price: 500, image: '/yūgo.jpg' },
//         { id: 11, name: 'ブラウニー（布朗尼）', quantity: 3, price: 500, image: '/buraunī.jpg' },
//         { id: 12, name: 'マカロン（马卡龙）', quantity: 3, price: 500, image: '/makaron.jpg' },
//         { id: 13, name: 'マドレーヌ（玛德琳）', quantity: 3, price: 500, image: '/madorēnu.jpg' },
//     ],
//     totalAmount: '¥2,970',
//     discount: '¥100',
//     finalAmount: '¥2,870',
//     deliveryFee: '¥1,870',
//     orderDate: '2023-05-01',
//     estimatedDelivery: '2023-05-05',
//     postalCode: '123-4567',
//     address: '東京都新宿区西新宿1-1-1',
// };


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
    const [orderId, setOrderId] = useState(null);
    const { fetchWithToken } = useAuth();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (router.isReady) {
            setOrderId(router.query.orderId);
        }
    }, [router.isReady]);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            if (!orderId) return;
            
            try {
                setLoading(true);
                const response = await fetchWithToken(
                    `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/${orderId}/`
                );
                console.log("useEffect response", response);
                
                setOrderData(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setError("注文詳細の取得に失敗しました");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId, fetchWithToken]);

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md">
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    if (!orderData) {
        return (
            <Container maxWidth="md">
                <Typography>注文データが見つかりません</Typography>
            </Container>
        );
    }

    const handleBreadcrumbClick = (event) => {
        event.preventDefault();
        router.push('/order-history');
    };
    const shouldShowCancelButton = orderData.orderStatus == "01" || orderData.orderStatus == "02";
    const orderStatusText = ORDER_STATUS_MAP[orderData.orderStatus] || "不明なステータス";

    const cancelOrder = async (order_id) => {
        try {
            console.log("cancel order", order_id);
            const response = await fetchWithToken(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/update/${order_id}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: "06" })
                });
            if (response.status !== "success") throw new Error("Failed to fetch orders");
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
                    注文番号　: 
                    {orderId}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    注文状況　: 
                    {orderStatusText}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    追跡番号　: {orderData.trackingNumber}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    注文日　　: {orderData.orderDate}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    予想配達日: {orderData.estimatedDelivery}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    郵便番号　: {orderData.postalCode}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    住所　　　: {orderData.address}
                </Typography>
            </Box>

            {shouldShowCancelButton && (
                <Stack direction="row" spacing={2}>
                    <Button size="small"
                        variant="outlined"
                        color="warning"
                        startIcon={<DeleteIcon />}
                        onClick={() => cancelOrder(orderId)}
                    >
                        注文キャンセル
                    </Button>
                </Stack>
            )}
            {/* 商品列表 */}
            <List>
                {orderData.items.map((item) => (
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
                        {orderData.discount}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        配送料:
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {orderData.deliveryFee}
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
                        {orderData.finalAmount}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default OrderDetailPage;
