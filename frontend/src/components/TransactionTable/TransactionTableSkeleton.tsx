import React from 'react';
import styles from './TransactionTable.module.css';
import Icon from '../Icon/Icon';
import TableHeader from './TableHeader';

const TransactionTableSkeleton: React.FC = () => {
  return (
    <table className={styles.table}>
      <TableHeader />
      <tbody>
        {Array.from({ length: 20 }).map((_, i) => (
          <tr key={i}>
            <td>
              <div className={styles.nameCell}>
                <div className={styles.checkbox} />
                <div className={styles.square} />
                <div className={styles.textWide} />
              </div>
            </td>
            <td>
              <div className={styles.textMedium} />
            </td>
            <td>
              <div className={styles.textShort} />
            </td>
            <td>
              <div className={styles.textShort} />
            </td>
            <td>
              <Icon name="menu" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTableSkeleton;
