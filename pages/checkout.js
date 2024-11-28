import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CheckoutPage = () => {
  const { fetchWithToken } = useAuth();
  const { clearCart } = useCart();

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

  // 获取数据 默认地址数据
  // 请求参数：商品id，数量
  // 响应：商品总价，运费，合计  --运费需要根据地址计算，因此地址变化需要重新请求获取价格详情，价格与地址分两个api？
  const fetchDefaultAddress = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/default/get`
      );
      console.log("fetchDefaultAddress", response);
      setDefaultAddress(response.data.address_detail);
      // return response.data.address_detail
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPreviewOrderInfo = async () => {
    const productList = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));

    // console.log("Product list for preview order:", productList);
    const requestBody = {
      product_list: productList,
    };

    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/order/preview/`,
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );
      // console.log("fetchPreviewOrderInfo", response);
      setOrderInfo(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsCartOpen(false);
    fetchDefaultAddress();
    fetchPreviewOrderInfo();
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("PayPay");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();
  // const handlePaymentMethodChange = (event) => setPaymentMethod(event.target.value);
  const handlePaymentMethodChange = () => {};

  const shippingFee = 10;
  const totalAmount =
    cart.reduce((sum, product) => sum + product.price * product.quantity, 0) +
    shippingFee;

  const handlePlaceOrder = async () => {
    const productList = cart.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
    }));
    
    const orderData = {
      product_list: productList,
    };

    console.log("orderData:", orderData);

    try {
      setIsSubmitting(true);

      // 1. 先创建订单
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

        // 2. 调用PayPay支付接口
        const paymentResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/payment/create/${orderId}`,
          {
            ...orderData,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Payment initiated:", paymentResponse.data);

        if (paymentResponse.data.status === "success") {
          // 清空购物车
          clearCart();
          // 跳转到PayPay支付页面
          router.push(paymentResponse.data.data.payment_link);
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
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 3 }}>
      {/* 配送地址部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">配送先</Typography>
        {defaultAddress.address_id ? (
          <>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">
                  {defaultAddress.last_name}
                  {defaultAddress.first_name} {defaultAddress.phone_number}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  〒 {defaultAddress.postal_code}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {defaultAddress.prefecture_address}
                  {defaultAddress.city_address}
                  {defaultAddress.district_address}
                  {defaultAddress.detail_address}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            おすすめの住所が設定されていません。おすすめの住所を設定するか、新しい住所を追加してください。
          </Typography>
        )}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => router.push("/addressList")}
          >
            住所を管理
          </Button>
        </Box>
      </Box>

      {/* 商品リスト部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">商品リスト</Typography>
        {cart.map((product) => (
          <Grid
            container
            spacing={2}
            key={product.id}
            sx={{ mt: 1, alignItems: "center" }}
          >
            <Grid item xs={2}>
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography>{product.name}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>数量: {product.quantity}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>価格: ¥{product.price.toLocaleString("ja-JP")}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>

      {/* 金額部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">料金詳細</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>商品合計:</Typography>
          <Typography>¥{orderInfo.product_total_price.toLocaleString("ja-JP")}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>配送料:</Typography>
          <Typography>¥{orderInfo.shipping_fee.toLocaleString("ja-JP")}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            fontWeight: "bold",
          }}
        >
          <Typography>合計:</Typography>
          <Typography>¥{orderInfo.total_price.toLocaleString("ja-JP")}</Typography>
        </Box>
      </Box>

      {/* 支払い方法部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">支払い方法</Typography>
        <RadioGroup
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
          sx={{ mt: 2 }}
        >
          {/* <FormControlLabel
            value="creditCard"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image src="/creditCardLogo.png" alt="クレジットカード" width={20} height={20} />
                <Typography sx={{ ml: 1 }}>クレジットカード</Typography>
              </Box>
            }
          /> */}
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
                <Typography sx={{ ml: 1 }}>PayPay</Typography>
              </Box>
            }
          />
          {/* <FormControlLabel
            value="cashOnDelivery"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image src="/cashOnDeliveryLogo.png" alt="現金引換" width={20} height={20} />
                <Typography sx={{ ml: 1 }}>現金引換</Typography>
              </Box>
            }
          /> */}
        </RadioGroup>
      </Box>

      {/* 注文ボタン */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={!defaultAddress.address_id}
        onClick={handlePlaceOrder}
      >
        注文
      </Button>
    </Box>
  );
};

export default CheckoutPage;
