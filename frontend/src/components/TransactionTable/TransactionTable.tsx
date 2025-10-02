import React from 'react';
import styles from './TransactionTable.module.css'; // assuming
import { TransactionContext } from '../../store/transactions-context';
import { CURRENCY_SIGNS } from '../../utils/utils';
import Icon from '../Icon/Icon';
import OptionsMenu from '../OptionsMenu/OptionsMenu';
import TableHeader from './TableHeader';
import TransactionsNotFound from './TransactionsNotFound';
import Button from '../Button/Button';

const PAGE_SIZE = 9;

const TransactionTable: React.FC = React.memo(function Transactions() {
  const { transactions, handleOpenSideBar } =
    React.useContext(TransactionContext);
  const hasData = transactions.length > 0;

  const [page, setPage] = React.useState(1);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageSlice = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, page]);

  return (
    <>
      <table className={styles.table}>
        <TableHeader />
        {hasData ? (
          <tbody>
            {pageSlice.map((tx) => {
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

      {transactions.length > PAGE_SIZE && (
        <nav
          className={styles.paginationFixed}
          aria-label="Transactions pagination"
        >
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>

          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>

          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            Next ›
          </button>
        </nav>
      )}

      <Button className={styles.addButton} onClick={handleOpenSideBar}>
        +
      </Button>
    </>
  );
});

export default TransactionTable;
