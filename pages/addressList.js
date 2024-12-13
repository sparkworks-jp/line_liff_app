// components/AddressList.js
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Checkbox,
  Card,
  CardContent,
  CardActions,
  FormControlLabel,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { RadioButtonUnchecked, CheckCircle } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { getPrefectureById } from "../data/addressData";
import { useMessage } from "../context/MessageContext";

const AddressList = () => {
  const [addressList, setAddressList] = useState([]);
  const router = useRouter();
  const { fetchWithToken } = useAuth();
  const { showMessage } = useMessage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    fetchDeleteAddress();
    setSelectedAddressId(null);
    setDialogOpen(false);
  };

  // Send a request to get a list of addresses
  const fetchAddressList = async () => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/list`
      );

      // Check if the response is valid
      if (
        !response ||
        !response.data ||
        !Array.isArray(response.data.address_list)
      ) {
        console.warn(
          "Response data format is incorrect or address list is empty",
          response
        );
        setAddressList([]);
      }

      console.log("Address list get successfully:", response.data.address_list);
      const updatedAddressList = response.data.address_list.map((addr) => {
        const prefectureData = getPrefectureById(addr.prefecture_address);
        return {
          ...addr,
          prefecture_address_name: prefectureData ? prefectureData.name : "",
        };
      });
      const sortedAddressList = updatedAddressList.sort((a, b) =>
        b.is_default - a.is_default
      );
      setAddressList(sortedAddressList);

    } catch (error) {
      console.error("Failed to get address list:", error);
      setAddressList([]);
    }
  };

  // Set default address request
  const setDefaultAddress = async (address_id) => {
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/${address_id}/dafault/set`,
        {
          method: "PATCH",
        }
      );

      if (response.status == "success") {
        console.log("Default address set successfully");
        await fetchAddressList();
      }
    } catch (error) {
      console.log("Default address setting failed:", error);
    }
  };

  // Delete address
  const handleDeleteAddress = (address_id) => {
    const address = addressList.find((addr) => addr.address_id === address_id);
    if (address && address.is_default) {
      showMessage("選択中お届け先は削除できません。", "error");
      return;
    }
    setSelectedAddressId(address_id);
    handleOpen();
  };

  const fetchDeleteAddress = async () => {
    const address_id = selectedAddressId;
    try {
      const response = await fetchWithToken(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/user/addresses/${address_id}/delete`,
        {
          method: "DELETE",
        }
      );
      if (response.status == "success") {
        console.error("Delete successfully");
        showMessage("住所が削除されました", "success");
        fetchAddressList();
      }
    } catch (error) {
      console.error("Failed to get address list:", error);
    }
  };

  useEffect(() => {
    fetchAddressList();
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
        <Typography
          variant="body1"
          align="center"
          sx={{
            my: 3,
            color: "#666",
            fontSize: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <i
            className="material-icons"
            style={{ fontSize: "3rem", marginBottom: "0.5rem", color: "#ddd" }}
          >
            location_off
          </i>
          現在住所が登録されていません。
        </Typography>
      ) : (
        addressList.map((addr) => (
          <Card
            key={addr.address_id}
            sx={{
              mb: 2,
              border: addr.is_default
                ? "2px solid rgb(182, 212, 244)"
                : "1px solid #e0e0e0",
              borderRadius: "12px",
              boxShadow: addr.is_default
                ? "0px 4px 10px rgba(180, 231, 255, 0.2)"
                : "0px 2px 4px rgba(0, 0, 0, 0.1)",
              backgroundColor: addr.is_default ? "#f0f8ff" : "#fff",
              transition: "all 0.3s ease",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                <Grid item xs={4}>
                  <FormControlLabel
                    label="お届け先"
                    sx={{
                      marginLeft: 0,
                      '& .MuiFormControlLabel-label': {
                        fontSize: '1.1rem',
                        fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", "メイリオ", "Noto Sans JP", sans-serif',
                        fontWeight: 500,
                        letterSpacing: '0.02em',
                      }
                    }}
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
                <Grid item xs={2}></Grid>
                <Grid item xs={3}>
                  <Button
                    size="large"

                    startIcon={<DeleteForeverIcon />}
                    onClick={() => handleDeleteAddress(addr.address_id)}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: '#ffebee',
                      },
                      minWidth: '80px',
                      fontSize: '1.1rem',
                      fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", "メイリオ", "Noto Sans JP", sans-serif',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      padding: '2px 4px',
                    }}
                  >
                    削除
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    size="small"
                    startIcon={<BorderColorIcon />}
                    onClick={() => handleEditAddress(addr)}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                      minWidth: '80px',
                      fontSize: '1.1rem',
                      fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", "メイリオ", "Noto Sans JP", sans-serif',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      padding: '2px 4px',
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
        sx={{
          mt: 3,
          textTransform: "none",
          backgroundColor: "primary",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0056b3",
          },
        }}
        onClick={() => router.push("/address")}
      >
        新規住所を追加
      </Button>

      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirm}
        // title="Delete Item"
        message="本当にこの住所を削除してもよろしいですか？"
        confirmText="削除する"
        cancelText="キャンセル"
        confirmColor="error"
      />
    </Box>
  );
};

export default AddressList;
