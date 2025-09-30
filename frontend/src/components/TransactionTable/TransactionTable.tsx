import React from 'react';
import styles from './TransactionTable.module.css';
import Icon from '../Icon/Icon';
import OptionsMenu from '../OptionsMenu/OptionsMenu';
import { CURRENCY_SIGNS } from '../../utils/utils';
import TableHeader from './TableHeader';
import TransactionsNotFound from './TransactionsNotFound';
import { TransactionContext } from '../../store/transactions-context';
import Button from '../Button/Button';

const TransactionTable: React.FC = React.memo(function Transactions() {
  const { transactions, handleOpenSideBar } =
    React.useContext(TransactionContext);
  const hasData = transactions.length > 0;

  return (
    <>
      <table className={styles.table}>
        <TableHeader />
        {hasData ? (
          <tbody>
            {transactions.map((tx) => {
              return (
                <tr key={tx.id}>
                  <td className={styles.nameCell}>
                    <input type="checkbox" />
                    <div className={styles.iconWrapper}>
                      <Icon name={tx.category} />
                    </div>
                    <span className={styles.nameText}>{tx.name}</span>
                  </td>
                  <td>{tx.category}</td>
                  <td>{tx.date}</td>
                  <td className={styles.amount}>
                    {CURRENCY_SIGNS[tx.currency]} {tx.amount}
                  </td>
                  <td>
                    <OptionsMenu transaction={tx} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <TransactionsNotFound
            title="The list of transactions are empty"
            subtitle="start to add a new one by clicking add button in the left bottom corner of your screen"
          />
        )}
      </table>
      <Button className={styles.addButton} onClick={handleOpenSideBar}>
        +
      </Button>
    </>
  );
});

export default TransactionTable;
