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
import { useAddress } from "../context/AddressContext";
import axios from "axios";

const CheckoutPage = () => {
  const router = useRouter();
  const { total } = router.query; 
  console.log(total, "total")
  // const [addressList, setAddressList] = useState([
  //   {
  //     id: 1,
  //     name: "愛海富村",
  //     phone: "080-1234-5678",
  //     address: "滋賀県野洲市小南28番32号",
  //     postcode: "520-2301",
  //   },
  //   {
  //     id: 2,
  //     name: "研二京極",
  //     phone: "080-8765-4321",
  //     address: "青森県平川市館田東稲村7番5号",
  //     postcode: "036-0155",
  //   },
  // ]);

  const {
    setAddressList,
    setSelectedAddressId,
    selectedAddressId,
    addressList,
  } = useAddress();

  useEffect(() => {
    // 模拟默认地址数据
    const defaultAddress = {
      id: 1,
      firstName: "武藏",
      lastName: "宮本",
      phone: "080-1234-5678",
      address: "滋賀県野洲市小南",
      detailAddress: "28番32号sdfsdgsdgsdgsdgdsfgsfdgretrhfdfhhhhh",
      postcode: "520-2301",
    };

    setAddressList([defaultAddress]); // 设置地址列表为单条地址
    setSelectedAddressId(defaultAddress.id); // 设置默认地址为选中状态
  }, [setAddressList, setSelectedAddressId]);

  // 找到选中的地址
  const selectedAddress = addressList.find(
    (addr) => addr.id === selectedAddressId
  );

  // const selectedAddress = null;

  const [paymentMethod, setPaymentMethod] = useState("PayPay");
  const [editAddress, setEditAddress] = useState({
    id: null,
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    detailAddress: "",
    postcode: "",
  });

  const { cart, removeFromCart, updateQuantity, isCartOpen, setIsCartOpen } =
    useCart();
  // const handlePaymentMethodChange = (event) => setPaymentMethod(event.target.value);
  const handlePaymentMethodChange = () => {};

  // const products = [
  //   { id: 1, name: 'Product 1', quantity: 1, price: 100, image: '/cappuccino.jpg' },
  //   { id: 2, name: 'Product 2', quantity: 2, price: 50, image: '/espresso.jpg' }
  // ];

  const shippingFee = 10;
  const totalAmount =
    cart.reduce((sum, product) => sum + product.price * product.quantity, 0) +
    shippingFee;

    const handlePlaceOrder = async () => {
      // const User = localStorage.getItem("user");
      // const userInfo = User ? JSON.parse(User) : null;
      const orderData = {
        // userId: userInfo.userId,
        // userName:userInfo.userName,
        userId: "111111",
        userName:"lucas",
        cart: cart,
        total: total,
      };
      console.log("orderData:", orderData);
      // console.log("userId:", userInfo.userId);
  
      try {
        const response = await axios.post(
          'https://pxgboy2hi7zpzhyitpghh6iy4u0iyyno.lambda-url.ap-northeast-1.on.aws/',
          orderData, 
          {
            headers: {
              'Content-Type': 'application/json', 
            },
          }
        );      
        console.log("Order placed successfully:", response.data);
        const data = response.data;
        if (data.resultInfo.code == "SUCCESS") {
          console.log(data.data.url);
          router.push(data.data.url);
        }
      } catch (error) {
        console.error("Error placing order:", error);
      }
    };


  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 3 }}>
      {/* 配送地址部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">配送先</Typography>
        {selectedAddress ? (
          <>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">
                  {selectedAddress.lastName}
                  {selectedAddress.firstName} {selectedAddress.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  〒 {selectedAddress.postcode}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {selectedAddress.address} {selectedAddress.detailAddress}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            まだ住所が登録されていません。新しい住所を追加してください。
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
              <Typography>価格: ¥{product.price}</Typography>
            </Grid>
          </Grid>
        ))}
      </Box>

      {/* 金額部分 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">料金詳細</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>商品合計:</Typography>
          <Typography>
            ¥
            {cart.reduce(
              (sum, product) => sum + product.price * product.quantity,
              0
            )}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography>配送料:</Typography>
          <Typography>¥{shippingFee}</Typography>
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
          <Typography>¥{totalAmount}</Typography>
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
      <Button variant="contained" color="primary" fullWidth disabled={!selectedAddress} onClick={handlePlaceOrder}>
        注文
      </Button>
    </Box>
  );
};

export default CheckoutPage;

