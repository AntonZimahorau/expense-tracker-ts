import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/auth-context';
import styles from './Header.module.css';
import Button from '../Button/Button';
import { memo } from 'react';

const Header = memo(function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/signin', { replace: true });
  };

  return (
    <header className={styles.header}>
      <img src="/Logo.png" alt="YAET Logo" className={styles.logo} />

      <div className={styles.actions}>
        <Link
          to="/user_profile"
          className={`${styles.btn} ${styles.btnPrimary}`}
        >
          User data
        </Link>
        <Button
          type="button"
          className={`${styles.btn} ${styles.btnOutline}`}
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
    </header>
  );
});

export default Header;
