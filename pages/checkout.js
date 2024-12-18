import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useDrag } from "@use-gesture/react"; 
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { getPrefectureById, prefecture } from "../data/addressData";

const CheckoutPage = () => {
  const { fetchWithToken } = useAuth();
  const { clearCart } = useCart();
  const [currentAddress, setCurrentAddress] = useState(null);
  const [addressList, setAddressList] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState({
    address_id: null,
    first_name: "",
    last_name: "",
    first_name_katakana: "",
    last_name_katakana: "",
    phone_number: "",
    postal_code: "",
    prefecture_address: "",
    city_address: "",
    district_address: "",
    detail_address: "",
    is_default: false,
  });

  const [orderInfo, setOrderInfo] = useState({
    product_total_price: 0,
    shipping_fee: 0,
    total_price: 0,
  });

  const handleSelectAddress = (address) => {
    setCurrentAddress(address);
    setDialogOpen(false);
  };

  let swipeTimeout = null;

  const bind = useDrag(({ direction: [xDir], movement: [xMovement], touches }) => {
    const SWIPE_THRESHOLD = 50; 
  
    if (touches > 1) return;
  
    if (xDir < 0 && Math.abs(xMovement) > SWIPE_THRESHOLD) {
      if (swipeTimeout) return; 
  
      swipeTimeout = setTimeout(() => {
        console.log("Swiped Left: checkout Returning to shop");
        router.push("/shop");
        swipeTimeout = null; 
      }, 300); 
    }
  });

  // get data , default address data
  // parameter: product id , product amount
  // response: total price, shipment fee  --shipment fee calculation api todo?
  const fetchDefaultAddress = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/default/get`
      );
      console.log("fetchDefaultAddress", response);
      if (response.data && response.data.address_detail) {
        const address = response.data.address_detail;
        const prefecture = getPrefectureById(address.prefecture_address);
        address.prefecture_address = prefecture ? prefecture.name : "";
        setDefaultAddress(address);
      } else {
        setDefaultAddress(null);
        setCurrentAddress(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAddressList = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/list`
      );
      if (response.data && Array.isArray(response.data.address_list)) {
        const updatedAddressList = response.data.address_list.map((address) => {
          const prefecture = getPrefectureById(address.prefecture_address);
          return {
            ...address,
            prefecture_address: prefecture ? prefecture.name : "",
          };
        });
        setAddressList(updatedAddressList);
      } else {
        setAddressList([]);
      }
    } catch (error) {
      console.error("Failed to fetch address list:", error);
    }
  };

  const fetchPreviewOrderInfo = async (address) => {
    const productList = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const requestBody = {
      product_list: productList,
      address_id: address ? address.address_id : null,
    };

    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/preview/`,
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );
      setOrderInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (defaultAddress && defaultAddress.address_id) {
      setCurrentAddress(defaultAddress);
    }
  }, [defaultAddress]);

  useEffect(() => {
    fetchPreviewOrderInfo(currentAddress);
  }, [currentAddress]);

  useEffect(() => {
    setIsCartOpen(false);
    fetchDefaultAddress();
    fetchAddressList();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("PayPay");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();
  // const handlePaymentMethodChange = (event) => setPaymentMethod(event.target.value);
  const handlePaymentMethodChange = () => {};

  //mock shippingFee
  const shippingFee = 100;
  cart.reduce((sum, product) => sum + product.price * product.quantity, 0) +
    shippingFee;

  const handlePlaceOrder = async () => {
    const productList = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    const orderData = {
      product_list: productList,
      address_id: currentAddress.address_id,
    };

    try {
      setIsSubmitting(true);

      // 1. create order
      const orderResponse = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/create/`,
        {
          method: "POST",
          body: JSON.stringify(orderData),
        }
      );
      console.log("注文作成成功:", orderResponse);
      console.log("Order created successfully:", orderResponse.data);

      if (orderResponse.data && orderResponse.data.order_id) {
        const orderId = orderResponse.data.order_id;

        // 2. call paypay
        const paymentResponse = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/payment/create/${orderId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Payment initiated:", paymentResponse.data);
        if (paymentResponse.status === "success") {
          clearCart();
          router.push(paymentResponse.data.payment_link);
        } else {
          throw new Error("支払い処理に失敗しました");
        }
      } else {
        throw new Error(
          orderResponse.data.message || "注文の作成に失敗しました"
        );
      }
    } catch (error) {
      console.error("Error in order process:", error);
      alert(error.message || "注文処理中にエラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 3 }} {...bind()}>
      {/* 配送地址部分 */}
      {currentAddress ? (
        <Box
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "rgb(247, 247, 247)",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            {currentAddress.last_name} {currentAddress.first_name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {currentAddress.phone_number}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            〒{currentAddress.postal_code} {currentAddress.prefecture_address}
            {currentAddress.city_address} {currentAddress.district_address}{" "}
            {currentAddress.detail_address}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            mb: 2,
            textAlign: "center",
            backgroundColor: "#fffbe6",
            borderRadius: "8px",
            border: "1px dashed #ffcc00",
            color: "#ff6961",
            fontStyle: "italic",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            住所が設定されていません。
          </Typography>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "right", gap: 2, mb: 3 }}>
        {addressList.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => setDialogOpen(true)}
            sx={{
              textTransform: "none",
              borderColor: "primary",
              color: "primary",
              "&:hover": {
                backgroundColor: "#e6f0ff",
              },
            }}
          >
            お届け先を変更
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => router.push("/addressList")}
          sx={{
            textTransform: "none",
            backgroundColor: "primary",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0056b3",
            },
          }}
        >
          住所管理
        </Button>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: "10px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            position: "absolute",
            top: "15%",
            transform: "translateY(-15%)",
          },
        }}
      >
        <Button
          onClick={() => setDialogOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            minWidth: "auto", 
            padding: 0,
            color: "#666"
          }}
        >
          <CloseIcon />
        </Button>

        <DialogTitle sx={{ fontSize: "1.1rem", color: "primary" }}>
          今度注文のお届け先を選択
        </DialogTitle>

        <DialogContent>
          {addressList.map((addr) => (
            <Box
              key={addr.address_id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor:
                  currentAddress?.address_id === addr.address_id
                    ? "#f0f8ff"
                    : "#fff",
                transition: "background-color 0.3s",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {addr.last_name} {addr.first_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                〒{addr.postal_code} {addr.prefecture_address}{" "}
                {addr.city_address} {addr.district_address}{" "}
                {addr.detail_address}
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => handleSelectAddress(addr)}
                sx={{
                  mt: 2,
                  textTransform: "none",
                }}
              >
                この住所を使う
              </Button>
            </Box>
          ))}
        </DialogContent>
      </Dialog>

      {/* 商品リスト部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          商品リスト
        </Typography>
        {cart.map((product, index) => (
          <Box
            key={product.id}
            sx={{
              borderBottom:
                index !== cart.length - 1 ? "1px solid #e0e0e0" : "none",
              pb: 2,
              mb: 2,
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={60}
                  height={60}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  数量: {product.quantity}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  variant="body1"
                  align="right"
                  sx={{ fontWeight: "bold" }}
                >
                  ¥{product.price.toLocaleString("ja-JP")}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>

      {/* 金額部分 */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>商品合計:</Typography>
          <Typography>
            ¥{orderInfo.product_total_price.toLocaleString("ja-JP")}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography>配送料:</Typography>
          <Typography>
            ¥{orderInfo.shipping_fee.toLocaleString("ja-JP")}
          </Typography>
        </Box>
        <Box sx={{ borderTop: "1px solid #e0e0e0", mt: 2, pt: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              sx={{ color: "orange", fontWeight: "bold", fontSize: "1.5rem" }}
            >
              合計:
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "orange", fontWeight: "bold", fontSize: "1.5rem" }}
            >
              ¥{orderInfo.total_price.toLocaleString("ja-JP")}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 支払い方法部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">お支払い</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          sx={{ mt: 2 }}
        >
          <FormControlLabel
            value="PayPay"
            control={<Radio />}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Image
                  src="/Paypay.svg.png"
                  alt="PayPay"
                  width={70}
                  height={20}
                />
              </Box>
            }
          />
        </RadioGroup>
      </Box>

      {/* 注文ボタン */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={!currentAddress}
        onClick={handlePlaceOrder}
      >
        注文
      </Button>
    </Box>
  );
};

export default CheckoutPage;
