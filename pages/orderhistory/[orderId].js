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
    Container,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import Grid from '@mui/material/Grid2';
import { useAuth } from '../../context/AuthContext';
import ConfirmationDialog from "../../components/ConfirmationDialog";


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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        if (router.isReady) {
            setOrderId(router.query.orderId);
        }
    }, [router.isReady]);


    useEffect(() => {
        fetchOrderDetail();
    }, [orderId, fetchWithToken]);

    const fetchOrderDetail = async () => {
        if (!orderId) return;
        try {
            setLoading(true);
            const response = await fetchWithToken(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/${orderId}/`
            );
            setOrderData(response.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching order details:", error);
            setError("注文詳細の取得に失敗しました");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        try {
            const response = await fetchWithToken(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/cancel/${orderId}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: 6 })
                }
            );

            if (response.status === "success") {
                setSnackbar({
                    open: true,
                    message: '注文キャンセルしました',
                    severity: 'success'
                });
                fetchOrderDetail();
            } else {
                throw new Error("Failed to cancel order");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            setSnackbar({
                open: true,
                message: '注文キャンセル失敗',
                severity: 'error'
            });
        } finally {
            setDialogOpen(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false
        }));
    };

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
    const shouldShowCancelButton = orderData.orderStatus == "01" || orderData.orderStatus == "02";
    const orderStatusText = ORDER_STATUS_MAP[orderData.orderStatus] || "不明なステータス";


    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                注文詳細
            </Typography>
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
                        onClick={handleCancelClick}
                    >
                        注文キャンセル
                    </Button>

                    <Button size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<HourglassTopRoundedIcon />}

                    >
                        決済
                    </Button>

                </Stack>
            )}
            <ConfirmationDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmCancel}
                message="このご注文をキャンセルしてもよろしいですか？"
                confirmText="キャンセルする"
                cancelText="戻る"
                confirmColor="error"
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* 商品List */}
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

            {/* 支付情報 */}
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
