import React, { createContext, useState, useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Create context
const MessageContext = createContext();

// provider component
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
      {/* Global message prompt */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          top: "10%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          maxWidth: "400px",
          borderRadius:"10px"
        }}
      >
        <Alert
          severity={severity}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            padding: "8px 16px", 
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </MessageContext.Provider>
  );
};

// Customize Hook
export const useMessage = () => useContext(MessageContext);
