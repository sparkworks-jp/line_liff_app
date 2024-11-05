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
import { useAddress } from "../context/AddressContext";
import axios from "axios";

const AddressPage = () => {
  const {
    addressList,
    setAddressList,
    selectedAddressId,
    setSelectedAddressId,
  } = useAddress();
  const [editAddress, setEditAddress] = useState({
    id: null,
    firstName: "",
    lastName: "",
    phone: "",
    postcode: "",
    address: "",
    detailAddress: ""
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [oldPostcode, setOldPostcode] = useState('')

  useEffect(() => {
    const addressList = [
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
    setAddressList(addressList);
  }, [setAddressList]);

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "lastName":
        if (!value) error = "姓は必須です";
        break;
      case "firstName":
        if (!value) error = "名は必須です";
        break;
      case "phone":
        if (!/^\d{3}-\d{4}-\d{4}$/.test(value)) {
          error = "正しい電話番号の形式（例: 080-1234-5678）で入力してください";
        }
        break;
      case "postcode":
        if (!/^\d{3}-\d{4}$/.test(value)) {
          error = "正しい郵便番号の形式（例: 123-4567）で入力してください";
        }
        break;
      case "address":
        if (!value) error = "住所は必須です、住所は丁目以上の形式で入力してください";
        break;
      case "detailAddress":
        if (!value) error = "詳しい住所は必須です、詳しい住所は番地以下・地番の形式で入力してください";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };

  const handlePhoneChange = (event) => {
    const input = event.target.value.replace(/\D/g, "");
    setEditAddress({ ...editAddress, phone: formatPhoneNumber(input) });
  };

  const formatPhoneNumber = (input) => {
    const match = input.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (!match) return "";
    const [_, part1, part2, part3] = match;
    return part2 ? `${part1}-${part2}${part3 ? "-" + part3 : ""}` : part1;
  };

  const handlePostcodeChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // 只允许数字
    setEditAddress({ ...editAddress, postcode: formatPostcode(input) });
  };

  const formatPostcode = (input) => {
    const match = input.match(/^(\d{0,3})(\d{0,4})$/);
    if (!match) return "";
    const [_, part1, part2] = match;
    return part2 ? `${part1}-${part2}` : part1;
  };

  const handleSaveAddress = () => {
    const fields = [
      "lastName",
      "firstName",
      "phone",
      "postcode",
      "address",
      "detailAddress",
    ];
    fields.forEach((field) => validateField(field, editAddress[field]));

    if (Object.values(errors).every((error) => !error)) {
      if (editAddress.id) {
        setAddressList(
          addressList.map((addr) =>
            addr.id === editAddress.id ? editAddress : addr
          )
        );
      } else {
        setAddressList([...addressList, { ...editAddress, id: Date.now() }]);
      }
      setEditAddress({
        id: null,
        firstName: "",
        lastName: "",
        phone: "",
        postcode: "",
        address: "",
        detailAddress: "",
      });
    }
  };

  const postCodeToAddress = (postcode) => {
    console.log(postcode);

    const formatPostcode = postcode.replace("-", "");
    console.log(formatPostcode);

    // 防抖动，减少请求次数
    if (oldPostcode == postcode) {
      return;
    }
    setOldPostcode(postcode);

    let url =
      "https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + formatPostcode;

    if (formatPostcode.length == 7) {
      axios
        .get(url)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.results == null) {
              // message.error("郵便番号に該当する住所は存在しません");
              return;
            }

            console.log(res);

            let address =
              res.data.results[0].address1 +
              res.data.results[0].address2 +
              res.data.results[0].address3;

            setEditAddress({ ...editAddress, address: address });
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
      <Typography variant="h6" sx={{ mb: 3 }}>住所管理</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="姓"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.lastName}
            onChange={(e) =>
              setEditAddress({ ...editAddress, lastName: e.target.value })
            }
            onBlur={() => validateField("lastName", editAddress.lastName)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            fullWidth
            label="名"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.firstName}
            onChange={(e) =>
              setEditAddress({ ...editAddress, firstName: e.target.value })
            }
            onBlur={() => validateField("firstName", editAddress.firstName)}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            fullWidth
            label="電話番号"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.phone}
            onChange={handlePhoneChange}
            onBlur={() => validateField("phone", editAddress.phone)}
            placeholder="080-1234-5678"
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            fullWidth
            label="郵便番号"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.postcode}
            onChange={handlePostcodeChange}
            onBlur={() => {
              validateField("postcode", editAddress.postcode);
              postCodeToAddress(editAddress.postcode);
            }}
            placeholder="123-1234"
            error={!!errors.postcode}
            helperText={errors.postcode}
          />
          <TextField
            fullWidth
            label="住所"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.address}
            onChange={(e) =>
              setEditAddress({ ...editAddress, address: e.target.value })
            }
            onBlur={() => validateField("address", editAddress.address)}
            error={!!errors.address}
            helperText={errors.address}
            placeholder="丁目以上"
          />
          <TextField
            fullWidth
            label="詳しい住所"
            variant="outlined"
            sx={{ mb: 2 }}
            required
            value={editAddress.detailAddress}
            onChange={(e) =>
              setEditAddress({ ...editAddress, detailAddress: e.target.value })
            }
            onBlur={() =>
              validateField("detailAddress", editAddress.detailAddress)
            }
            error={!!errors.detailAddress}
            helperText={errors.detailAddress}
            placeholder="番地以下・地番"
          />
          <Button variant="contained" onClick={handleSaveAddress}>
            {editAddress.id ? "保存" : "追加"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddressPage;
