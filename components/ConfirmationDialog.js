import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = "",
  message = "この操作を実行してもよろしいですか?",
  confirmText = "確認",
  cancelText = "キャンセル",
  confirmColor = "primary",
  cancelColor = "primary",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "1rem",
          padding: "0.5rem",
        },
      }}
    >
      {title && (
        <DialogTitle
          id="confirmation-dialog-title"
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {title}
        </DialogTitle>
      )}

      <DialogContent>
        <DialogContentText
          id="confirmation-dialog-description"
          sx={{
            fontSize: "1rem",
            color: "#555",
            textAlign: "center",
            padding: "8px 0",
            lineHeight: 1.6,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: "16px",
          paddingBottom: "1rem",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color={cancelColor}
          sx={{
            fontSize: "0.9rem",
            borderRadius: "0.6rem",
            padding: "0.4rem 1rem",
            color: "#1976d2",
            borderColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="outlined"
          color={confirmColor}
          sx={{
            fontSize: "0.9rem",
            borderRadius: "0.6rem",
            padding: "0.4rem 1rem",
            backgroundColor: "#f44336",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#d32f2f",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
