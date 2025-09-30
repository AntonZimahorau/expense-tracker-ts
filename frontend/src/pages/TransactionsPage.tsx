import Header from '../components/Header/Header';
import Transactions from '../components/Transactions/Transactions';
import TransactionProvider from '../store/transactions-context';

export default function TransactionsPage() {
  return (
    <>
      <Header />
      <TransactionProvider>
        <Transactions />
      </TransactionProvider>
    </>
  );
}
