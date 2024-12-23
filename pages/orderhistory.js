import React, { useEffect, useState } from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Box,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMessage } from "../context/MessageContext";
import Countdown from "react-countdown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "../styles/OrderHistory.module.css";

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const { fetchWithToken } = useAuth();
  const router = useRouter();
  const { showMessage } = useMessage();

  // 初回レンダリング時に注文データを取得
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/orders/`
        );
        if (response.status !== 200) throw new Error("Failed to fetch orders");
        console.log("response.data orders", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [fetchWithToken]);

  // 注文をクリックしたときに詳細ページへ遷移
  const handleOrderClick = (orderId) => {
    router.push(`/orderhistory/${orderId}`);
  };

  // 注文を削除する処理
  const handleDelete = async (orderId) => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/delete/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === "success") {
        setOrders(orders.filter((order) => order.id !== orderId));
        showMessage("注文が削除されました。", "success");
      } else {
        throw new Error(response.message || "削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      showMessage("削除に失敗しました", "error");
    }
  };

  // 注文をキャンセルする処理
  const handleCancelOrder = async (orderId) => {
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
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: 5 } : order
          )
        );
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  // 注文状態のテキストを取得
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "支払い待ち";
      case 2:
        return "支払い済み";
      case 3:
        return "発送済み";
      case 4:
        return "完了";
      case 5:
        return "キャンセル";
      default:
        return "不明な状態";
    }
  };

  // 注文状態クラス名を取得
  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return styles["status--pending"];
      case 2:
        return styles["status--paid"];
      case 3:
        return styles["status--shipped"];
      case 4:
        return styles["status--completed"];
      case 5:
        return styles["status--cancelled"];
      default:
        return "";
    }
  };

  // タイマー
  const getCancelTimer = (date, status, orderId) => {
    // 支払い待ちの状態のみ表示する
    if (status === 1) {
      const deadline = new Date(date);
      deadline.setHours(
        deadline.getHours() +
          parseInt(process.env.NEXT_PUBLIC_PAYMENT_TIMEOUT_HOURS, 10)
      );
      console.log("Deadline:", deadline);
      const now = new Date();
      console.log("now", now);

      //注文時間＞締め切り時間（環境変数に定義する）の場合、注文をキャンセする（再決済できなくなる）　  
      if (now > deadline) {
        handleCancelOrder(orderId);
        // タイマーを表示しない
        return null;
      }

      return (
        <Box className={styles.timer}>
          <AccessTimeIcon className={styles.timerIcon} />
          <Countdown
            date={deadline}
            renderer={({ hours, minutes, seconds }) => (
              <span>
                {`${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                  2,
                  "0"
                )}:${String(seconds).padStart(2, "0")}`}
              </span>
            )}
            onComplete={() => handleCancelOrder(orderId)}
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <List>
        {/* 注文アイテム */}
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <ListItem
              className={styles.listItem}
              onClick={() => handleOrderClick(order.id)}
            >
              <ListItemText
                primary={
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={6}>
                      <Typography component="span" variant="body1">
                        注文日: {order.date}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        component="span"
                        className={`${styles.status} ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                secondary={
                  <>
                    <Box display="flex" justifyContent="space-between" mt={1}>
                      <Box>
                        {/* 注文アイテムのリンク */}
                        <Link
                          component="span"
                          className={styles.link}
                          onClick={() => handleOrderClick(order.id)}
                        >
                          {order.items.length > 15
                            ? `${order.items.slice(0, 10)}...`
                            : order.items}
                        </Link>
                        <Typography
                          component="span"
                          sx={{
                            marginLeft: "1px",
                            fontSize: "0.9rem",
                            fontWeight: "bold",
                          }}
                        >
                          {` — 合計: ${order.total}`}
                        </Typography>
                      </Box>

                      {getCancelTimer(order.created_at, order.status, order.id)}
                    </Box>
                  </>
                }
              />

              {order.status !== 1 && order.status !== 2 && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(order.id);
                  }}
                  className={styles.deleteButton}
                >
                  <DeleteIcon className={styles.deleteIcon}/>
                </IconButton>
              )}
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
}
