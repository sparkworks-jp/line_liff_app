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

const AddressList = () => {
  const [addressList, setAddressList] = useState([]);
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
    // const initialAddressList = [
    //   {
    //     addressId: 1,
    //     firstName: "武藏",
    //     lastName: "宮本",
    //     firstNameKatakana: "",
    //     lastNameKatakana: "",
    //     phone: "080-1234-5678",
    //     prefectureAddress: "滋賀県",
    //     cityAddress: "野洲市",
    //     districtAddress: "小南",
    //     detailAddress: "28番32号",
    //     postalCode: "520-2301",
    //     isDefault: true,
    //   },
    //   {
    //     addressId: 2,
    //     firstName: "太郎",
    //     lastName: "山田",
    //     firstNameKatakana: "",
    //     lastNameKatakana: "",
    //     phone: "080-9876-5432",
    //     prefectureAddress: "京都市",
    //     cityAddress: "中京区",
    //     districtAddress: "二条通河原町",
    //     detailAddress: "西入る",
    //     postalCode: "600-8001",
    //     isDefault: false,
    //   },
    // ];
    const initialAddressList = [];
    setAddressList(initialAddressList);
  }, [setAddressList]);

  const handleEditAddress = (addr) => {
    router.push({
      pathname: "/address",
      query: { id: addr.addressId },
    });
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        住所リスト
      </Typography>
      {addressList.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ my: 3 }}>
          現在住所が登録されていません。
        </Typography>
      ) : (
        addressList.map((addr) => (
          <Card key={addr.addressId} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {addr.lastName}
                    {addr.firstName} {addr.phone}
                  </Typography>
                  <Typography variant="body1">〒 {addr.postalCode}</Typography>
                  <Typography variant="body1">
                    {addr.prefectureAddress}
                    {addr.cityAddress}
                    {addr.districtAddress}
                    {addr.detailAddress}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Grid
                container
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
                        checked={addr.isDefault}
                        onChange={() => setDefaultAddress(addr.addressId)}
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
                    onClick={() => deleteAddress(addr.addressId)}
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
        ))
      )}
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
