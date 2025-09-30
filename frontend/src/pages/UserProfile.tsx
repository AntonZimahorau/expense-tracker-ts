import styles from './Auth.module.css';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button/Button';
import WelcomeImage from './WelcomeImage';
import { getUserData } from '../utils/http';
import { User } from '../utils/utils';
import { useState, useEffect, useCallback } from 'react';

export default function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);

  const fetchUserData = useCallback(async () => {
    try {
      const data = await getUserData();
      setUserData(data);
      console.log(data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <main className={styles.card} role="main" aria-labelledby="user-title">
      <WelcomeImage />

      <h2 id="user-title" className={styles.title}>
        Account details
      </h2>

      <div className={styles.info}>
        <div className={styles.row}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{userData?.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{userData?.email}</span>
        </div>
      </div>

      <Button className={styles.btnPrimary} onClick={() => navigate('/')}>
        Show transactions
      </Button>
    </main>
  );
}
