import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDrag } from "@use-gesture/react"; 
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
  CircularProgress
} from "@mui/material";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import { useAuth } from "../../context/AuthContext";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { getPrefectureById } from "../../data/addressData";
import { useMessage } from "../../context/MessageContext";

const ORDER_STATUS_MAP = {
  1: "支払い待ち",
  2: "支払い済み",
  3: "発送済み",
  4: "完了",
  5: "キャンセル",
};

const OrderDetailPage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const { fetchWithToken } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { showMessage } = useMessage();

  const bind = useDrag(({ direction: [xDir] }) => {
    if (xDir < 0) {
      console.log("Swiped Left: Returning to OrderHistoryPage");
      router.push("/orderhistory");
    }
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
      const orderData = response.data;
      const prefectureMatch = orderData.address.match(/^(\d{1,2})/);
      if (prefectureMatch) {
        const prefectureId = prefectureMatch[1];
        const prefectureData = getPrefectureById(prefectureId);
        if (prefectureData) {
          const prefectureName = prefectureData.name;
          orderData.address = `${prefectureName} ${orderData.address
            .slice(prefectureId.length)
            .trim()}`;
        }
      }

      setOrderData(orderData);
      setError(null);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("注文詳細の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const paymentResponse = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/payment/create/${orderId}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (paymentResponse.status === "success") {
        console.log("Payment post success:", paymentResponse.data);
        router.push(paymentResponse.data.payment_link);
      } else {
        throw new Error("再決済処理に失敗しました");
      }
    } catch (error) {
      console.error("Error in order process:", error);
      alert(error.message || "再決済処理中にエラーが発生しました");
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
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === "success") {
        showMessage("注文がキャンセルされました！", "success");
        fetchOrderDetail();
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      showMessage("注文キャンセルが失敗しました！", "error");
    } finally {
      setDialogOpen(false);
    }
  };

 

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
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
  const shouldShowCancelButton = orderData.orderStatus == 1;
  const orderStatusText =
    ORDER_STATUS_MAP[orderData.orderStatus] || "不明なステータス";

  return (
    <Container maxWidth="md" {...bind()}>
      <Typography variant="h4" gutterBottom sx={{ marginTop: "20px" }}>
        注文詳細
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          注文番号　: {orderId}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          注文状況　: {orderStatusText}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          追跡番号　: {orderData.trackingNumber ? rderData.trackingNumber : "-"}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          注文日　　: {orderData.orderDate}
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
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleCancelClick}
          >
            注文キャンセル
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<HourglassTopRoundedIcon />}
            onClick={handlePayment}
          >
            お支払い
          </Button>
        </Stack>
      )}
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        message="注文をキャンセルしてもよろしいですか？"
        confirmText="キャンセルする"
        cancelText="戻る"
        confirmColor="error"
      />

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

      <Box sx={{ mt: 2 }}>
        {/* 割引金額行 */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" color="text.secondary">
            割引金額:
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {orderData.discount}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" color="text.secondary">
            配送料:
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {orderData.deliveryFee}
          </Typography>
        </Box>

        {/* 合計支払金額行 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 1,
          }}
        >
          <Typography variant="subtitle1" color="text.secondary">
            合計支払金額:
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "orange",
              fontWeight: "bold",
              fontSize: "2rem",
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
