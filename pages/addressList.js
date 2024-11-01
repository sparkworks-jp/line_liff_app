// components/AddressList.js
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Checkbox,
  IconButton,
  Card,
  CardContent,
  CardActions,
  FormControlLabel,
} from "@mui/material";
import { Delete, RadioButtonUnchecked, CheckCircle } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useAddress } from "../context/AddressContext";

const AddressList = () => {
  const {
    addressList,
    setSelectedAddressId,
    setAddressList,
    selectedAddressId,
  } = useAddress();
  const router = useRouter();

  // 发送请求获取地址列表
  const fetchAddressList = async () => {
    try {
      const response = await axios.get("/api/getAddressList");
      // 假设返回的数据结构是 { data: [...] }
      return response.data;
    } catch (error) {
      console.error("获取地址列表失败:", error);
      throw error; // 需要时可以处理错误
    }
  };

  // 设置默认地址请求
  const setDefaultAddress = async (addressId) => {
    try {
      await axios.post("/api/setDefaultAddress", { addressId });
      console.log("默认地址设置成功");
    } catch (error) {
      console.error("设置默认地址失败:", error);
      throw error;
    }
  };

  // 删除地址请求
  const deleteAddress = async (addressId) => {
    try {
      await axios.delete(`/api/deleteAddress/${addressId}`);
      console.log("地址删除成功");
    } catch (error) {
      console.error("删除地址失败:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initialAddressList = [
      {
        id: 1,
        firstName: "武藏",
        lastName: "宮本",
        phone: "080-1234-5678",
        address: "滋賀県野洲市小南",
        detailAddress: "28番32号",
        postcode: "520-2301",
      },
      {
        id: 2,
        firstName: "太郎",
        lastName: "山田",
        phone: "080-9876-5432",
        address: "京都市中京区二条通河原町",
        detailAddress: "西入る",
        postcode: "600-8001",
      },
    ];
    setAddressList(initialAddressList);
    setSelectedAddressId(1);
  }, [setAddressList]);

  const handleEditAddress = (addr) => {
    router.push({
      pathname: "/address",
      query: { id: addr.id },
    });
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        住所リスト
      </Typography>
      {addressList.map((addr) => (
        <Card key={addr.id} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h6">
                  {addr.lastName}
                  {addr.firstName} {addr.phone}
                </Typography>
                <Typography variant="body1">〒 {addr.postcode}</Typography>
                <Typography variant="body1">
                  {addr.address} {addr.detailAddress}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Grid
              container
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                mb: 1,
              }}
            >
              <Grid item xs={4}>
                <FormControlLabel
                  label="おすすめ"
                  control={
                    <Checkbox
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<CheckCircle />}
                    />
                  }
                />
              </Grid>
              <Grid item xs={4}></Grid>
              <Grid item xs={2}>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    /* handleDeleteAddress(addr.id); */
                  }}
                  sx={{
                    fontSize: "1.0rem",
                    padding: "2px 6px",
                    minWidth: "auto",
                    backgroundColor: "#d3d3d3",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#c0c0c0",
                    },
                  }}
                >
                  削除
                </Button>
              </Grid>
              <Grid item xs={2}>
                <Button
                  size="small"
                  onClick={() => handleEditAddress(addr)}
                  sx={{
                    fontSize: "1.0rem",
                    padding: "2px 6px",
                    minWidth: "auto",
                    backgroundColor: "#d3d3d3",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#c0c0c0",
                    },
                  }}
                >
                  編集
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      ))}
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={() => router.push("/address")} // 跳转到新增页面
      >
        新規住所を追加
      </Button>
    </Box>
  );
};

export default AddressList;
