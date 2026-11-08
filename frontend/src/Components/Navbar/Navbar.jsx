import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/aronnok-logo.png';
import { signOut } from '../../session';
import UserNotification from '../UserNotification/UserNotification';
import SearchDropDown from '../SearchDropDown/SearchDropDown';
import { API } from '../../backend';

// How often the cart and notification badges refresh.
const POLL_MS = 5000;

// Main menu. `match` lists the URL prefixes that count as being on that page,
// so the current page is highlighted wherever the user came from.
const MENU = [
  { key: 'home', label: 'Home', to: (id) => `/home/${id}`, match: ['/home/'] },
  { key: 'auctions', label: 'Auctions', to: (id) => `/auctionsall/${id}`, match: ['/auctionsall/', '/auction/'] },
  { key: 'favourites', label: 'Favourites', to: (id) => `/favourites/${id}`, match: ['/favourites/'] },
  { key: 'wishlist', label: 'Wishlist', to: (id) => `/wishlist/${id}`, match: ['/wishlist/'] },
  { key: 'orders', label: 'Orders', to: (id) => `/orderlist/${id}`, match: ['/orderlist/', '/orderstatus/'] },
];

// Closes a popup when the user clicks outside `ref` or presses Escape.
function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [ref, open, onClose]);
}

const Badge = ({ count, label }) =>
  count > 0 ? (
    <span className="nav-badge" aria-label={`${count} ${label}`}>
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

const Navbar = ({ userId }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  useDismiss(userMenuRef, isUserMenuOpen, () => setUserMenuOpen(false));

  // Close the mobile menu after navigating.
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!userId) return undefined;

    const fetchCounts = async () => {
      try {
        const response = await fetch(`${API}/api/cart/viewCart/${userId}`);
        const data = await response.json();
        setCartCount((data.items ?? []).reduce((total, item) => total + item.quantity, 0));
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
      try {
        const response = await fetch(`${API}/api/notification/${userId}`);
        const data = await response.json();
        setUnreadCount((data.messages ?? []).filter((message) => !message.read).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchCounts();
    const intervalId = setInterval(fetchCounts, POLL_MS);
    return () => clearInterval(intervalId);
  }, [userId]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut().catch(() => {});
    navigate('/login', { replace: true });
  };

  const isActive = (item) => item.match.some((prefix) => pathname.startsWith(prefix));

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button
          type="button"
          className="nav-icon-btn nav-hamburger"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="nav-menu"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <i className={isMobileMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'} aria-hidden="true" />
        </button>

        <Link to={`/home/${userId}`} className="nav-logo">
          <img src={logo} alt="" />
          <span>Aronnok</span>
        </Link>

        <nav aria-label="Main">
          <ul id="nav-menu" className={`nav-menu${isMobileMenuOpen ? ' is-open' : ''}`}>
            {MENU.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to(userId)}
                  className={`nav-link${isActive(item) ? ' is-active' : ''}`}
                  aria-current={isActive(item) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-search">
          <SearchDropDown userId={userId} />
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="nav-icon-btn"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(true)}
          >
            <i className="bi bi-bell" aria-hidden="true" />
            <Badge count={unreadCount} label="unread" />
          </button>

          <Link to={`/viewcart/${userId}`} className="nav-icon-btn" aria-label="Cart">
            <i className="bi bi-cart3" aria-hidden="true" />
            <Badge count={cartCount} label="items in cart" />
          </Link>

          <div className="nav-user" ref={userMenuRef}>
            <button
              type="button"
              className={`nav-icon-btn${isUserMenuOpen ? ' is-pressed' : ''}`}
              aria-label="Account"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              <i className="bi bi-person-circle" aria-hidden="true" />
            </button>
            {isUserMenuOpen && (
              <div className="nav-user-menu" role="menu">
                <Link to={`/profile/${userId}`} role="menuitem" onClick={() => setUserMenuOpen(false)}>
                  <i className="bi bi-person" aria-hidden="true" /> Profile
                </Link>
                <a href="/login" role="menuitem" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right" aria-hidden="true" /> Log out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {isNotificationsOpen && (
        <div className="notification-overlay">
          <UserNotification userId={userId} onClose={() => setNotificationsOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
