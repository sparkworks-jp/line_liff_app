import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, Grid , Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";
import { prefecture, getPrefectureById } from "../data/addressData"; 

const AddressPage = () => {
  const [editAddress, setEditAddress] = useState({
    address_id: null,
    first_name: "",
    last_name: "",
    first_name_katakana: "",
    last_name_katakana: "",
    phone_number: "",
    postal_code: "",
    prefecture_address_id: null,
    city_address: "",
    district_address: "",
    detail_address: "",
    is_default: false,
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [oldPostalCode, setOldPostalCode] = useState("");
  const { id } = router.query;
  const { fetchWithToken } = useAuth();
  const { showMessage } = useMessage();
  
  const fetchAddressDeatil = async (address_id) => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/${address_id}/detail`
      );
  
      console.log("get address detail succeed:", response.data.address_detail);
      const addressDetail = response.data.address_detail;
  
      const prefectureData = getPrefectureById(addressDetail.prefecture_address);
      const prefectureId = prefectureData ? prefectureData.id : null;
  
      setEditAddress({
        ...addressDetail,
        prefecture_address_id: prefectureId,
      });
    } catch (error) {
      console.error("get address detail failed:", error);
    }
  };
  

  useEffect(() => {
    const fetchData = async () => {
      if (id !== undefined) {
        fetchAddressDeatil(id);
      }
    };

    fetchData();
  }, [id]);

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "last_name":
        if (!value) error = "姓は必須です";
        break;
      case "first_name":
        if (!value) error = "名は必須です";
        break;
      case "last_name_katakana":
        if (!value) error = "セイは必須です";
        break;
      case "first_name_katakana":
        if (!value) error = "メイは必須です";
        break;
      case "phone_number":
        if (!/^\d{3}-\d{4}-\d{4}$/.test(value)) {
          error = "正しい電話番号の形式（例: 080-1234-5678）で入力してください";
        }
        break;
      case "postal_code":
        if (!/^\d{3}-\d{4}$/.test(value)) {
          error = "正しい郵便番号の形式（例: 123-4567）で入力してください";
        }
        break;
      case "prefecture_address_id":
        if (!value) error = "住所は必須です";
        break;
      case "city_address":
        if (!value) error = "住所は必須です";
        break;
      case "district_address":
        if (!value) error = "住所は必須です";
        break;
      case "detail_address":
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
    const input = event.target.value.replace(/\D/g, ""); // only allow number
    setEditAddress({ ...editAddress, postal_code: formatPostalCode(input) });
  };

  const formatPostalCode = (input) => {
    const match = input.match(/^(\d{0,3})(\d{0,4})$/);
    if (!match) return "";
    const [_, part1, part2] = match;
    return part2 ? `${part1}-${part2}` : part1;
  };

  const handleSaveAddress = async () => {
    // validate all required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "first_name_katakana",
      "last_name_katakana",
      "phone_number",
      "postal_code",
      "prefecture_address",
      "city_address",
      "district_address",
      "detail_address",
    ];

    let isValid = true;
    let newErrors = {};

    requiredFields.forEach((field) => {
      const value = editAddress[field];
      validateField(field, value);
      if (errors[field]) {
        newErrors[field] = errors[field];
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    // prepare to save address
    const addressData = {
      address_id: editAddress.address_id, // if update,use the existed address id
      first_name: editAddress.first_name,
      last_name: editAddress.last_name,
      first_name_katakana: editAddress.first_name_katakana,
      last_name_katakana: editAddress.last_name_katakana,
      phone_number: editAddress.phone_number,
      postal_code: editAddress.postal_code,
      prefecture_address_id: editAddress.prefecture_address_id,
      city_address: editAddress.city_address,
      district_address: editAddress.district_address,
      detail_address: editAddress.detail_address,
    };

    try {
      // if have addressId，use PUT to update
      if (id) {
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/${id}/update`,
          {
            method: "PUT",
            body: JSON.stringify(addressData),
          }
        );
        if (response.status === "success") {
          showMessage("住所が更新されました！", "success");
          router.push("/addressList");
        }
      } else {
        // if not, we should use POST to create a new address
        const response = await fetchWithToken(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/add`,
          {
            method: "POST",
            body: JSON.stringify(addressData),
          }
        );
        if (response.status === "success") {
          showMessage("住所が保存されました！", "success");
          router.push("/addressList");
        }
      }
    } catch (error) {
      console.error("there's error when saving address:", error);
      setErrors({
        ...errors,
        serverError: "住所の保存に失敗しました。もう一度お試しください。",
      });
    }
  };

  const handlePrefectureChange = (event) => {
    const value = event.target.value;
    setEditAddress({
      ...editAddress,
      prefecture_address_id: event.target.value, 
    });
  };

  const postalCodeToAddress = (postalCode) => {
    const formatPostalCode = postalCode.replace("-", "");
    if (oldPostalCode === postalCode) return;
    setOldPostalCode(postalCode);
  
    const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${formatPostalCode}`;
    if (formatPostalCode.length === 7) {
      axios.get(url).then((res) => {
        if (res.status === 200 && res.data.results) {
          const { address1, address2, address3 } = res.data.results[0];
          const prefectureData = prefecture.find(
            (pref) => pref.name === address1
          );
          const prefectureId = prefectureData ? prefectureData.id : null;
  
          setEditAddress((prev) => ({
            ...prev,
            prefecture_address_id: prefectureId,
            city_address: address2 || "",
            district_address: address3 || "",
          }));
        }
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
            onBlur={() => validateField("first_name", editAddress.first_name)}
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
              validateField(
                "last_name_katakana",
                editAddress.last_name_katakana
              )
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
              validateField(
                "first_name_katakana",
                editAddress.first_name_katakana
              )
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
            onBlur={() =>
              validateField("phone_number", editAddress.phone_number)
            }
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
            <FormControl fullWidth sx={{ mb: 2 }} required>
              <InputLabel
                id="prefecture-label"
                shrink
                sx={{
                  position: "absolute",
                  top: "-4px",
                  left: "-2px", 
                }}
              >
                住所（都道府県）
              </InputLabel>
              <Select
                labelId="prefecture-label"
                value={editAddress.prefecture_address_id || ""}
                onChange={handlePrefectureChange}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  都道府県を選択してください
                </MenuItem>
                  {prefecture.map((pref) => (
                  <MenuItem key={pref.id} value={pref.id}>
                    {pref.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.prefecture_address_id && (
                <Typography color="error">{errors.prefecture_address_id}</Typography>
              )}
            </FormControl>
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
            onBlur={() =>
              validateField("city_address", editAddress.city_address)
            }
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
