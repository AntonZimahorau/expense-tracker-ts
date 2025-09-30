import React from 'react';
import styles from './TransactionTable.module.css';

const TableHeader: React.FC = React.memo(function TableHeader() {
  return (
    <>
      <colgroup>
        <col className={styles.colName} />
        <col className={styles.colCategory} />
        <col className={styles.colDate} />
        <col className={styles.colTotal} />
        <col className={styles.colActions} />
      </colgroup>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Date</th>
          <th>Total</th>
          <th aria-label="Actions"></th>
        </tr>
      </thead>
    </>
  );
});

export default TableHeader;
