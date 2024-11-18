import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Grid,
  Radio,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const AddressPage = () => {
  const [editAddress, setEditAddress] = useState({
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
  const [addressInfo, setAddressInfo] = useState({});
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [oldPostalCode, setOldPostalCode] = useState("");
  const { id } = router.query;
  const { fetchWithToken } = useAuth();

  // const fetchAddressDeatil = async (addressId) => {
  //   try {
  //     const response = await axios.get(`/api/getAddress/${addressId}`);
  //     // 假设返回的数据结构是 { data: [...] }
  //     return response.data;
  //   } catch (error) {
  //     console.error("获取地址详情失败:", error);
  //     throw error; // 需要时可以处理错误
  //   }
  // };

  const fetchAddressDeatil = async (address_id) => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/${address_id}/detail`
      );

      console.log("地址详细获取成功:", response.data.address_detail);
      setEditAddress(response.data.address_detail)
    } catch (error) {
      console.error("获取地址详细失败:", error);
    }
  };

  // 模拟数据
  const simulatedAddress = {
    addressId: 2,
    firstName: "太郎",
    lastName: "山田",
    firstNameKatakana: "タロ",
    lastNameKatakana: "ヤマダ",
    phone: "080-9876-5432",
    postalCode: "600-8001",
    prefectureAddress: "京都市",
    cityAddress: "中京区",
    districtAddress: "二条通河原町",
    detailAddress: "西入る",
    isDefault: true,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id !== undefined) {
        // 注释掉真实请求，暂时使用模拟数据
        fetchAddressDeatil(id);
        // // 模拟数据逻辑
        // setEditAddress(simulatedAddress);
      }
    };

    fetchData();
  }, [id]);

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "lastName":
        if (!value) error = "姓は必須です";
        break;
      case "firstName":
        if (!value) error = "名は必須です";
        break;
      case "lastNameKatakana":
        if (!value) error = "セイは必須です";
        break;
      case "firstNameKatakana":
        if (!value) error = "メイは必須です";
        break;
      case "phone":
        if (!/^\d{3}-\d{4}-\d{4}$/.test(value)) {
          error = "正しい電話番号の形式（例: 080-1234-5678）で入力してください";
        }
        break;
      case "postalCode":
        if (!/^\d{3}-\d{4}$/.test(value)) {
          error = "正しい郵便番号の形式（例: 123-4567）で入力してください";
        }
        break;
      case "prefectureAddress":
        if (!value) error = "住所は必須です";
        break;
      case "cityAddress":
        if (!value) error = "住所は必須です";
        break;
      case "districtAddress":
        if (!value) error = "住所は必須です";
        break;
      case "detailAddress":
        if (!value) error = "詳しい住所は必須です";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handlePhoneChange = (event) => {
    const input = event.target.value.replace(/\D/g, "");
    setEditAddress({ ...editAddress, phone_number: formatPhoneNumber(input) });
  };

  const formatPhoneNumber = (input) => {
    const match = input.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (!match) return "";
    const [_, part1, part2, part3] = match;
    return part2 ? `${part1}-${part2}${part3 ? "-" + part3 : ""}` : part1;
  };

  const handlePostalCodeChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // 只允许数字
    setEditAddress({ ...editAddress, postal_code: formatPostalCode(input) });
  };

  const formatPostalCode = (input) => {
    const match = input.match(/^(\d{0,3})(\d{0,4})$/);
    if (!match) return "";
    const [_, part1, part2] = match;
    return part2 ? `${part1}-${part2}` : part1;
  };

  const handleSaveAddress = async () => {
    // 校验所有必填字段是否有错误
    const requiredFields = [
      "lastName",
      "firstName",
      "lastNameKatakana",
      "firstNameKatakana",
      "phone",
      "postalCode",
      "prefectureAddress",
      "cityAddress",
      "districtAddress",
      "detailAddress",
    ];

    let isValid = true;
    let newErrors = {};

    // 遍历并验证所有必填字段
    requiredFields.forEach((field) => {
      const value = editAddress[field];
      validateField(field, value);
      if (errors[field]) {
        newErrors[field] = errors[field];
        isValid = false;
      }
    });

    // 如果有错误，更新错误状态并阻止保存
    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    // 如果没有错误，准备保存地址信息
    const addressData = {
      addressId: editAddress.addressId, // 如果是更新，使用现有的地址ID
      firstName: editAddress.firstName,
      lastName: editAddress.lastName,
      firstNameKatakana: editAddress.firstNameKatakana,
      lastNameKatakana: editAddress.lastNameKatakana,
      phone: editAddress.phone,
      postalCode: editAddress.postalCode,
      prefectureAddress: editAddress.prefectureAddress,
      cityAddress: editAddress.cityAddress,
      districtAddress: editAddress.districtAddress,
      detailAddress: editAddress.detailAddress,
      isDefault: editAddress.isDefault,
    };

    try {
      // 如果有 addressId，表示是更新，使用 PUT 请求
      if (editAddress.addressId) {
        const response = await axios.put(
          `/api/updateAddress/${editAddress.addressId}`,
          addressData
        );
        if (response.status === 200) {
          // 更新成功后，可以做跳转或者提示用户
          router.push("/address"); // 假设这是地址列表页面
        }
      } else {
        // 如果没有 addressId，表示是新增地址，使用 POST 请求
        const response = await axios.post("/api/addAddress", addressData);
        if (response.status === 200) {
          // 添加成功后，跳转或清空表单
          router.push("/address"); // 跳转到地址列表页面
        }
      }
    } catch (error) {
      console.error("保存地址时出错:", error);
      // 可以在此显示错误提示
      setErrors({
        ...errors,
        serverError: "住所の保存に失敗しました。もう一度お試しください。",
      });
    }
  };

  const postalCodeToAddress = (postalCode) => {
    console.log(postalCode);

    const formatPostalCode = postalCode.replace("-", "");
    console.log(formatPostalCode);

    // 防抖动，减少请求次数
    if (oldPostalCode == postalCode) {
      return;
    }
    setOldPostalCode(postalCode);

    let url =
      "https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + formatPostalCode;

    if (formatPostalCode.length == 7) {
      axios
        .get(url)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.results == null) {
              // message.error("郵便番号に該当する住所は存在しません");
              return;
            }

            const { address1, address2, address3 } = res.data.results[0];

            setEditAddress((prevAddress) => ({
              ...prevAddress,
              prefecture_address: address1,
              city_address: address2,
              district_address: address3,
            }));
          }
          //message.success(`ファイルのアップロードに成功しました`);
        })
        .catch(() => {
          //message.error(`ファイルのアップロードに失敗しました.`);
        });
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        住所管理
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="姓"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.last_name}
            onChange={(e) =>
              setEditAddress({ ...editAddress, last_name: e.target.value })
            }
            onBlur={() => validateField("last_name", editAddress.last_name)}
            error={!!errors.last_name}
            helperText={errors.last_name}
          />
          <TextField
            fullWidth
            label="名"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.first_name}
            onChange={(e) =>
              setEditAddress({ ...editAddress, first_name: e.target.value })
            }
            onBlur={() => validateField("firstName", editAddress.first_name)}
            error={!!errors.first_name}
            helperText={errors.first_name}
          />
          <TextField
            fullWidth
            label="セイ"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.last_name_katakana}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                last_name_katakana: e.target.value,
              })
            }
            onBlur={() =>
              validateField("last_name_katakana", editAddress.last_name_katakana)
            }
            error={!!errors.last_name_katakana}
            helperText={errors.last_name_katakana}
          />
          <TextField
            fullWidth
            label="メイ"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.first_name_katakana}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                first_name_katakana: e.target.value,
              })
            }
            onBlur={() =>
              validateField("first_name_katakana", editAddress.first_name_katakana)
            }
            error={!!errors.first_name_katakana}
            helperText={errors.first_name_katakana}
          />
          <TextField
            fullWidth
            label="電話番号"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.phone_number}
            onChange={handlePhoneChange}
            onBlur={() => validateField("phone_number", editAddress.phone_number)}
            placeholder="080-1234-5678"
            error={!!errors.phone_number}
            helperText={errors.phone_number}
          />
          <TextField
            fullWidth
            label="郵便番号"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.postal_code}
            onChange={handlePostalCodeChange}
            onBlur={() => {
              validateField("postal_code", editAddress.postal_code);
              postalCodeToAddress(editAddress.postal_code);
            }}
            placeholder="123-1234"
            error={!!errors.postal_code}
            helperText={errors.postal_code}
          />
          <TextField
            fullWidth
            label="住所（都道府県）"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.prefecture_address}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                prefecture_address: e.target.value,
              })
            }
            onBlur={() =>
              validateField("prefecture_address", editAddress.prefecture_address)
            }
            error={!!errors.prefecture_address}
            helperText={errors.prefecture_address}
            placeholder="例: 北海道"
          />
          <TextField
            fullWidth
            label="住所（市区町村）"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.city_address}
            onChange={(e) =>
              setEditAddress({ ...editAddress, city_address: e.target.value })
            }
            onBlur={() => validateField("city_address", editAddress.city_address)}
            error={!!errors.city_address}
            helperText={errors.city_address}
            placeholder="例: 美唄市"
          />
          <TextField
            fullWidth
            label="住所（町域）"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.district_address}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                district_address: e.target.value,
              })
            }
            onBlur={() =>
              validateField("district_address", editAddress.district_address)
            }
            error={!!errors.district_address}
            helperText={errors.district_address}
            placeholder="例: 上美唄町協和,"
          />
          <TextField
            fullWidth
            label="詳しい住所（町域以下）"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.detail_address}
            onChange={(e) =>
              setEditAddress({ ...editAddress, detail_address: e.target.value })
            }
            onBlur={() =>
              validateField("detail_address", editAddress.detail_address)
            }
            error={!!errors.detail_address}
            helperText={errors.detail_address}
            placeholder="町域以下"
          />
          <Button variant="contained" fullWidth onClick={handleSaveAddress}>
            {editAddress.address_id ? "住所を保存" : "住所を追加"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressPage;
