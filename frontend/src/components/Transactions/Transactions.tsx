import React from 'react';
import SideBar from '../SideBar/SideBar';
import TransactionTable from '../TransactionTable/TransactionTable';
import DateRangeInput from '../DateRangeInput/DateRangeInput';
import TransactionTableSkeleton from '../TransactionTable/TransactionTableSkeleton';
import styles from './Transactions.module.css';
import { TransactionContext } from '../../store/transactions-context';

const Transactions: React.FC = () => {
  const { isFetching, sideBarIsOpen } = React.useContext(TransactionContext);

  return (
    <div className={styles.tableContainer}>
      <DateRangeInput />
      {sideBarIsOpen && <SideBar />}
      {isFetching ? <TransactionTableSkeleton /> : <TransactionTable />}
    </div>
  );
};

export default Transactions;
