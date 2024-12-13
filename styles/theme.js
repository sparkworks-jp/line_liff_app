// styles/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", "メイリオ", "Noto Sans JP", sans-serif',
    allVariants: {
      letterSpacing: '0.02em',
      fontWeight: 500
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", "Meiryo", "メイリオ", "Noto Sans JP", sans-serif',
          fontWeight: 500,
          letterSpacing: '0.02em',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }
      }
    }
  }
});

