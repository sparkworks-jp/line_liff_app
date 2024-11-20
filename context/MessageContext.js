import React, { createContext, useState, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// 创建上下文
const MessageContext = createContext();

// 提供者组件
export const MessageProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info"); // 'success', 'error', 'warning', 'info'

  const showMessage = (msg, sev = "info") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}
      {/* 全局消息提示 */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "400px",
        }}
      >
        <Alert
          severity={severity}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center", // 垂直居中内容
            padding: "8px 16px", // 自定义内边距
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </MessageContext.Provider>
  );
};

// 自定义 Hook
export const useMessage = () => useContext(MessageContext);
