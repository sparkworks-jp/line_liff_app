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
import { useAuth } from "../context/AuthContext";

const AddressList = () => {
  const [addressList, setAddressList] = useState([]);
  const router = useRouter();
  const { fetchWithToken } = useAuth();

  // 发送请求获取地址列表
  const fetchAddressList = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/list`
      );

      // 检查响应是否有效
      if (
        !response ||
        !response.data ||
        !Array.isArray(response.data.address_list)
      ) {
        console.warn("响应数据格式不正确或地址列表为空", response);
        setAddressList([]);
      }

      console.log("地址列表获取成功:", response.data.address_list);
      setAddressList(response.data.address_list);
      // return response.data.address_list;
    } catch (error) {
      console.error("获取地址列表失败:", error);
      setAddressList([]);
    }
  };

  // 设置默认地址请求
  const setDefaultAddress = async (address_id) => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/${address_id}/dafault/set`,
        {
          method: "PATCH",
        }
      );

      if (response.status == "success") {
        console.log("默认地址设置成功");
        // 重新获取地址列表
        // 更新 addressList，将目标地址的 is_default 设置为 true，其余为 false
        setAddressList((prevAddressList) =>
          prevAddressList.map((address) =>
            address.address_id === address_id
              ? { ...address, is_default: true }
              : { ...address, is_default: false }
          )
        );
      }
    } catch (error) {
      console.log("默认地址设置失败:", error);
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
    fetchAddressList();
    // const initialAddressList = fetchAddressList();
    // setAddressList(initialAddressList);
  }, []);

  const handleEditAddress = (addr) => {
    router.push({
      pathname: "/address",
      query: { id: addr.address_id },
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
          <Card key={addr.address_id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {addr.last_name}
                    {addr.first_name} {addr.phone_number}
                  </Typography>
                  <Typography variant="body1">〒 {addr.postal_code}</Typography>
                  <Typography variant="body1">
                    {addr.prefecture_address}
                    {addr.city_address}
                    {addr.district_address}
                    {addr.detail_address}
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
                        checked={addr.is_default}
                        disabled={addr.is_default}
                        onChange={() => setDefaultAddress(addr.address_id)}
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
                    onClick={() => deleteAddress(addr.address_id)}
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
