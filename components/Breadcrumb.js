import React from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import MuiLink from '@mui/material/Link';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const pathConfig = {
  shop: { label: 'Shop', icon: <ShoppingCartIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
  order: { label: 'Order', icon: <ReceiptIcon sx={{ mr: 0.5 }} fontSize="inherit" /> },
};

const DynamicBreadcrumbs = () => {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(segment => segment);

  const breadcrumbsItems = pathSegments.map((segment, index) => {
    const shortLabel = segment.length > 20 ? segment.slice(0, 20) + '...' : segment;
    return {
      href: `/${pathSegments.slice(0, index + 1).join('/')}`,
      label: pathConfig[segment]?.label || shortLabel.charAt(0).toUpperCase() + shortLabel.slice(1),
      icon: pathConfig[segment]?.icon,
    };
  });

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" />}
    >
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
