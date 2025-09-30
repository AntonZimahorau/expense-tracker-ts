import { createContext, useState, useEffect, useCallback } from 'react';
import { Transaction, DateRangeValue, NewTransaction } from '../utils/utils';
import {
  fetchTransactions,
  deleteTransaction,
  updateTransaction,
  postTransaction,
} from '../utils/http';
import React from 'react';
import { subDays } from 'date-fns';
import { useErrorBanner } from '../components/GlobalErrorBanner/GlobalErrorBanner';

type TransactionContextType = {
  transactions: Transaction[];
  isFetching: boolean;
  refreshTransactions: () => void;
  dateRange: DateRangeValue;
  handleSetDateRange: (range: DateRangeValue) => void;
  sideBarIsOpen: boolean;
  handleOpenSideBar: () => void;
  handleCloseSideBar: () => void;
  handleDeleteTransaction: (transactionId: number) => void;
  handleClickEditTransaction: (transaction: Transaction) => void;
  editTransaction: Transaction | null;
  handleUpdateTransaction: (
    transactionId: number,
    updates: Partial<Transaction>,
  ) => void;
  handleCreateTransaction: (transaction: NewTransaction) => void;
};

export const TransactionContext = createContext<TransactionContextType>({
  transactions: [],
  isFetching: false,
  refreshTransactions: () => {},
  dateRange: { startDate: new Date(), endDate: new Date() },
  handleSetDateRange: () => {},
  sideBarIsOpen: false,
  handleOpenSideBar: () => {},
  handleCloseSideBar: () => {},
  handleDeleteTransaction: (transactionId: number) => {},
  handleClickEditTransaction: (transaction: Transaction) => {},
  editTransaction: null,
  handleUpdateTransaction: (
    transactionId: number,
    updates: Partial<Transaction>,
  ) => {},
  handleCreateTransaction: (transaction: NewTransaction) => {},
});

const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [sideBarIsOpen, setSideBarIsOpen] = useState<boolean>(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null,
  );

  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    startDate: subDays(today, 6),
    endDate: today,
  });

  const showError = useErrorBanner();

  const handleOpenSideBar = useCallback(() => {
    setSideBarIsOpen(true);
  }, []);

  const handleCloseSideBar = useCallback(() => {
    setEditTransaction(null);
    setSideBarIsOpen(false);
  }, []);

  const handleSetDateRange = useCallback(
    (range: DateRangeValue) => {
      setDateRange(range);
    },
    [setDateRange],
  );

  async function handleDeleteTransaction(transactionId: number) {
    try {
      await deleteTransaction(transactionId);
      setTransactions((prevTransactions) =>
        prevTransactions.filter((tx) => tx.id !== transactionId),
      );
    } catch (e) {
      showError('Unable to delete transaction');
    }
  }

  function handleClickEditTransaction(transaction: Transaction) {
    setEditTransaction(transaction);
    handleOpenSideBar();
  }

  const refreshTransactions = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await fetchTransactions(dateRange);
      setTransactions(data);
    } catch (e) {
      const msg = 'Unable to fetch transactions';
      showError(msg);
    } finally {
      setIsFetching(false);
    }
  }, [dateRange, showError]);

  async function handleUpdateTransaction(
    transactionId: number,
    updates: Partial<Transaction>,
  ) {
    try {
      await updateTransaction(transactionId, updates);
      handleCloseSideBar();
      refreshTransactions();
    } catch (e) {
      showError('Unable to update transaction');
    }
  }

  async function handleCreateTransaction(transaction: NewTransaction) {
    try {
      await postTransaction(transaction);
      handleCloseSideBar();
      refreshTransactions();
    } catch (e) {
      showError('Unable to create transaction');
    }
  }

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const ctxValue = {
    transactions,
    isFetching,
    refreshTransactions,
    dateRange,
    handleSetDateRange,
    sideBarIsOpen,
    handleOpenSideBar,
    handleCloseSideBar,
    handleDeleteTransaction,
    handleClickEditTransaction,
    editTransaction,
    handleUpdateTransaction,
    handleCreateTransaction,
  };

  return (
    <TransactionContext.Provider value={ctxValue}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
