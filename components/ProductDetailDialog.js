import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { motion } from "framer-motion";

const ProductDetailDialog = ({ product, open, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };
  const boxStyleFullscreen = {
    position: "absolute",
    top: 40,
    right: 19,
    display: "flex",
    gap: 1,
    zIndex: 10,
    padding: 1,
  };

  const boxStyleNormal = {
    position: "absolute",
    top: 0,
    right: 3,
    display: "flex",
    gap: 1,
    zIndex: 10,
    padding: 1,
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isFullscreen}
      PaperProps={{
        component: motion.div,
        initial: { scale: 0.1, opacity: 0 },
        animate: { scale: 1.1, opacity: 1 },
        exit: { scale: 0.3, opacity: 0 },
        transition: { duration: 0.5 },
        sx: {
          width: isFullscreen ? "100vw" : "80vw",
          height: isFullscreen ? "100vh" : "80vh",
          maxWidth: isFullscreen ? "none" : "800px",
          maxHeight: isFullscreen ? "none" : "90vh",
          borderRadius: isFullscreen ? "0" : "20px",
          overflow: "hidden",
        },
      }}
    >
      <DialogContent sx={{ padding: isFullscreen ? "80px 15px 0 15px" : "50px 0 0 0", position: "relative" }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <iframe
            src={product.webpageUrl}
            title={product.name}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </Box>

        <Box sx={isFullscreen ? boxStyleFullscreen : boxStyleNormal}>
          <IconButton onClick={toggleFullscreen}>
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
