import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div>
      <nav>
      <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/shop/shop">
          <a>Shop</a>
        </Link>
        <Link href="/cart/cart">
          <a>Cart</a>
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;