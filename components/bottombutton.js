import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import StoreIcon from '@mui/icons-material/Store';
import { useRouter } from 'next/router';

export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    const path = router.pathname;
    if (path === '/shop') setValue(0);
    else if (path === '/reservation') setValue(1);
    else if (path === '/orderhistory') setValue(2);
  }, [router.pathname]);


  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        router.push('/shop');
        break;
      case 1:
        router.push('/reservation');
        break;
      case 2:
        router.push('/orderhistory');
        break;
    }
  };
  return (
    <Box >
      <BottomNavigation
        showLabels
        value={value}
        onChange={handleChange}

      >
        <BottomNavigationAction label="ショップ" icon={<StoreIcon fontSize='large' color='primary'/>} />
        <BottomNavigationAction label="予約" icon={<EventSeatIcon fontSize='large' color='primary'/>} />
        <BottomNavigationAction label="注文履歴" icon={<ReceiptLongIcon fontSize='large' color='info'/>} />
      </BottomNavigation>
    </Box>
  );
}