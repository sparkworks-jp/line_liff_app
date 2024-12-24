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
  CircularProgress,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import { useAuth } from "../../context/AuthContext";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { getPrefectureById } from "../../data/addressData";
import { useMessage } from "../../context/MessageContext";
import { ORDER_STATUS_MAP } from "../../data/constants";
import orderStyles from "../../styles/OrderHistory.module.css";
import commonStyles from "../../styles/common.module.css";

const OrderDetailPage = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const { fetchWithToken } = useAuth();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { showMessage } = useMessage();

  // スワイプ動作を制御するタイマー
  let swipeTimeout = null;

  // 左スワイプで注文履歴ページに戻る
  const bind = useDrag(
    ({ direction: [xDir], movement: [xMovement], touches }) => {
      // スワイプの閾値
      const SWIPE_THRESHOLD = 50;

      // マルチタッチの場合は無視
      if (touches > 1) return;

      if (xDir < 0 && Math.abs(xMovement) > SWIPE_THRESHOLD) {
        // タイマー中は再度発動させない
        if (swipeTimeout) return;

        swipeTimeout = setTimeout(() => {
          console.log("Swiped Left: Returning to OrderHistoryPage");
          // 注文履歴ページに戻る
          router.push("/orderhistory");
          // タイマーをリセット
          swipeTimeout = null;
        }, 300);
      }
    }
  );
  // ルーター準備完了時に注文IDを設定
  useEffect(() => {
    if (router.isReady) {
      setOrderId(router.query.orderId);
    }
  }, [router.isReady]);

  // 注文詳細データを取得
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
      // 住所データから都道府県名を取得しフォーマット
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
      // 注文データを状態にセット
      setOrderData(orderData);
      // エラーをリセット
      setError(null);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("注文詳細の取得に失敗しました");
    } finally {
      // ローディングを終了
      setLoading(false);
    }
  };

  // 再決済処理
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
        // 支払いリンクにリダイレクト
        router.push(paymentResponse.data.payment_link);
      } else {
        throw new Error("再決済処理に失敗しました");
      }
    } catch (error) {
      console.error("Error in order process:", error);
      alert(error.message || "再決済処理中にエラーが発生しました");
    }
  };

  // キャンセルダイアログを開く
  const handleCancelClick = () => {
    setDialogOpen(true);
  };

  // 注文キャンセルの確認処理
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
        // データをリロード
        fetchOrderDetail();
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      showMessage("注文キャンセルが失敗しました！", "error");
    } finally {
      // ダイアログを閉じる
      setDialogOpen(false);
    }
  };

  if (loading) {
    // ローディング中の表示
    return (
      <Container
        maxWidth="md"
        className={`${commonStyles.container} ${commonStyles.mt20}`}
      >
        <CircularProgress />
      </Container>
    );
  }

  // エラー発生時の表示
  if (error) {
    return (
      <Container maxWidth="md">
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  // 注文データが存在しない場合の表示
  if (!orderData) {
    return (
      <Container maxWidth="md">
        <Typography>該当する注文データが見つかりません</Typography>
      </Container>
    );
  }
  // キャンセルボタンの表示条件
  const shouldShowCancelButton = orderData.orderStatus == 1;
  const orderStatusText = ORDER_STATUS_MAP[orderData.orderStatus] || "";

  return (
    <Container maxWidth="md" {...bind()}>
      <Typography variant="h4" gutterBottom className={commonStyles.mt20}>
        注文詳細
      </Typography>
      <Box className={commonStyles.mb10}>
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
      {/* キャンセルボタン */}
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
          {/* 再決済ボタン */}
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
      {/* キャンセル確認ダイアログ */}
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

      <Box className={commonStyles.mt20}>
        {/* 割引金額行 */}
        <Box className={commonStyles.box}>
          <Typography variant="subtitle1" color="text.secondary">
            割引金額:
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {orderData.discount}
          </Typography>
        </Box>
        <Box className={commonStyles.box}>
          <Typography variant="subtitle1" color="text.secondary">
            配送料:
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {orderData.deliveryFee}
          </Typography>
        </Box>

        {/* 合計支払金額行 */}
        <Box className={`${commonStyles.box} ${orderStyles.orderDetailBox} `}>
          <Typography variant="subtitle1" color="text.secondary">
            合計支払金額:
          </Typography>
          <Typography
            variant="subtitle1"
            className={orderStyles.orderDetailTotal}
          >
            {orderData.finalAmount}
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default OrderDetailPage;
