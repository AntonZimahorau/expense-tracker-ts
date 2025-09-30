import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import TransactionTable from '../../components/TransactionTable/TransactionTable';
import { TransactionContext } from '../../store/transactions-context';

jest.mock('../../components/Icon/Icon', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../components/OptionsMenu/OptionsMenu', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../components/Button/Button', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: (props: any) => React.createElement('button', props),
  };
});
jest.mock('../../components/TransactionTable/TransactionsNotFound', () => ({
  __esModule: true,
  default: (p: any) => <div>{p.title}</div>,
}));

describe('TransactionTable (init)', () => {
  test('renders header, empty state, and add button works', async () => {
    const handleOpenSideBar = jest.fn();
    const ctxValue = {
      transactions: [],
      handleOpenSideBar,
    };

    render(
      <TransactionContext.Provider value={ctxValue as any}>
        <TransactionTable />
      </TransactionContext.Provider>,
    );

    expect(
      screen.getByRole('columnheader', { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /category/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /total/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/the list of transactions are empty/i),
    ).toBeInTheDocument();

    const addBtn = screen.getByRole('button', { name: '+' });
    addBtn.click();
    expect(handleOpenSideBar).toHaveBeenCalled();
  });

  test('renders a single transaction row and shows its data', () => {
    const handleOpenSideBar = jest.fn();

    const tx = {
      id: 1,
      name: 'Coffee',
      category: 'restaurants',
      date: '2025-09-27',
      currency: 'USD',
      amount: 12,
    };

    render(
      <TransactionContext.Provider
        value={{ transactions: [tx], handleOpenSideBar } as any}
      >
        <TransactionTable />
      </TransactionContext.Provider>,
    );

    expect(
      screen.getByRole('columnheader', { name: /name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /category/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /total/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText(/the list of transactions are empty/i),
    ).not.toBeInTheDocument();

    expect(screen.getByText('Coffee')).toBeInTheDocument();
    expect(screen.getByText('restaurants')).toBeInTheDocument();
    expect(screen.getByText('2025-09-27')).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();

    expect(screen.getByRole('checkbox')).toBeInTheDocument();

    screen.getByRole('button', { name: '+' }).click();
    expect(handleOpenSideBar).toHaveBeenCalled();
  });
});
