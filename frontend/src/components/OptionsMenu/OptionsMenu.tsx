import React from 'react';
import styles from './OptionsMenu.module.css';
import IconButton from '../IconButton/IconButton';
import { Transaction } from '../../utils/utils';
import { TransactionContext } from '../../store/transactions-context';

interface OptionsMenuProps {
  transaction: Transaction;
}

const OptionsMenu: React.FC<OptionsMenuProps> = ({ transaction }) => {
  const { handleDeleteTransaction, handleClickEditTransaction } =
    React.useContext(TransactionContext);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  function handleClick() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div className={styles.optionsMenu}>
      <IconButton
        name="menu"
        size={15}
        selected={false}
        onSelect={handleClick}
      />

      {isOpen && (
        <div className={styles.optionsDropdown}>
          <button
            className={styles.optionsItem}
            onClick={() => handleClickEditTransaction(transaction)}
          >
            Edit
          </button>
          <button
            className={styles.optionsItem}
            onClick={() => handleDeleteTransaction(transaction.id)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default OptionsMenu;
