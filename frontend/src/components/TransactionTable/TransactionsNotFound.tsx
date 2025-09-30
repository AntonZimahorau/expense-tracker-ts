import React from 'react';
import styles from './TransactionTable.module.css';

interface TransactionsNotFoundProps {
  title: string;
  subtitle: string;
}

const TransactionsNotFound: React.FC<TransactionsNotFoundProps> = ({
  title,
  subtitle,
}) => {
  return (
    <tbody>
      <tr>
        <td colSpan={4}>
          <div className={styles.emptyState} role="status" aria-live="polite">
            <h2 className={styles.emptyTitle}>{title}</h2>
            <p className={styles.emptySubtitle}>{subtitle}</p>
            <img
              src="/no_transactions.svg"
              alt="No transactions"
              className={styles.illustration}
              aria-hidden="true"
            />
          </div>
        </td>
      </tr>
    </tbody>
  );
};

export default TransactionsNotFound;
