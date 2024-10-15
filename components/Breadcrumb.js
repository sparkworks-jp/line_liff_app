import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';

const pathConfig = {
  home: { label: 'Home', icon: <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
  shop: { label: 'Shop', icon: <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
  order: { label: 'Order', icon: <ReceiptIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
};

const DynamicBreadcrumbs = () => {
  const router = useRouter();
  // const pathSegments = router.asPath.split('/').filter(segment => segment);

  if (typeof window === 'undefined') {
    return null; 
  }
  const { pathname } = router;
  const pathSegments = pathname.split('/').filter(segment => segment);

  const breadcrumbsItems = [
    { href: '/', ...pathConfig.home },
    ...pathSegments.map((segment, index) => ({
      href: `/${pathSegments.slice(0, index + 1).join('/')}`,
      label: pathConfig[segment]?.label || segment.charAt(0).toUpperCase() + segment.slice(1),
      icon: pathConfig[segment]?.icon,
    }))
  ];

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbsItems.map((item, index) => {
        const isLast = index === breadcrumbsItems.length - 1;
        
        return isLast ? (
          <Typography
            key={item.href}
            sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
          >
            {item.icon}
            {item.label}
          </Typography>
        ) : (
          <NextLink key={item.href} href={item.href} passHref legacyBehavior>
            <MuiLink
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
            >
              {item.icon}
              {item.label}
            </MuiLink>
          </NextLink>
        );
      })}
    </Breadcrumbs>
  );
};

export default DynamicBreadcrumbs;