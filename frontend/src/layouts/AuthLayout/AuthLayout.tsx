import styles from './AuthLayout.module.css';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className={styles.page}>
      <aside className={styles.left}>
        <img src="/Logo.png" alt="YAET Logo" className={styles.brand} />
        <p className={styles.tagline}>YET ANOTHER EXPENSE TRACKER</p>

        <img
          src="/login.svg"
          alt="Expense tracking illustration"
          className={styles.hero}
        />
      </aside>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
