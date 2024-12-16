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

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const { fetchWithToken } = useAuth();
  const router = useRouter();
  const { showMessage } = useMessage();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
  const handleOrderClick = (orderId) => {
    router.push(`/orderhistory/${orderId}`);
  };
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
        showMessage("注文を削除しました", "success");
      } else {
        throw new Error(response.message || "削除に失敗しました");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      showMessage("削除に失敗しました", "error");
    }
  };

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
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return "#f57c00";
      case 2:
        return "#388e3c";
      case 3:
        return "#0288d1";
      case 4:
        return "#4caf50";
      case 5:
        return "#d32f2f";
      default:
        return "#9e9e9e";
    }
  };
  const getCancelTimer = (date, status, orderId) => {
    if (status === 1) {
      const deadline = new Date(date);
      deadline.setHours(
        deadline.getHours() +
          parseInt(process.env.NEXT_PUBLIC_PAYMENT_TIMEOUT_HOURS, 10)
      );

      console.log("Deadline:", deadline);

      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundColor: "#fff8e1",
            border: "1px solid #ffd54f",
            borderRadius: "8px",
            padding: "4px 8px",
            color: "#f57c00",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          <AccessTimeIcon
            sx={{
              fontSize: "1.2rem",
              marginRight: "4px",
              color: "#ffa000",
            }}
          />
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
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <List>
        {orders.map((order) => (
          <React.Fragment key={order.id}>
            <ListItem
              alignItems="flex-start"
              onClick={() => handleOrderClick(order.id)}
            >
              <ListItemText
                primary={
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item>
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ fontSize: "1rem" }}
                      >
                        注文日: {order.date}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          padding: "2px 4px",
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                          backgroundColor: getStatusColor(order.status),
                          color: "#fff",
                        }}
                      >
                        {getStatusText(order.status)}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                secondary={
                  <>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <Box>
                        <Link
                          component="span"
                          variant="body2"
                          color="primary"
                          underline="none"
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
                >
                  <DeleteIcon />
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
