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
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirmation-dialog-description"
          sx={{ fontSize: "1.25rem", lineHeight: 1.6 }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color={cancelColor}
          sx={{ fontSize: "1rem", padding: "8px 16px" }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          autoFocus
          sx={{ fontSize: "1rem", padding: "8px 16px" }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
