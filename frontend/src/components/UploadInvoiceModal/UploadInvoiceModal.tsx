import React, { useCallback, useMemo, useRef, useState } from 'react';
import styles from './UploadInvoiceModal.module.css';
import { parseInvoice, ExtractedInvoice } from '../../utils/invoice';
import Button from '../Button/Button';

type UploadInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPrefill: (data: ExtractedInvoice) => void;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = 'image/jpeg';

export default function UploadInvoiceModal({
  isOpen,
  onClose,
  onPrefill,
}: UploadInvoiceModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const resetState = () => {
    setError(null);
    setLoading(false);
    setDragOver(false);
  };

  const validate = (file: File): string | null => {
    if (!file) return 'No file selected';
    if (file.type !== ACCEPT) return 'Only JPG files are allowed';
    if (file.size > MAX_BYTES) return 'File is larger than 5MB';
    return null;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !files[0]) return;
      const file = files[0];

      const msg = validate(file);
      if (msg) {
        setError(msg);
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const data = await parseInvoice(file);
        onPrefill(data);
        onClose();
      } catch {
        const msg = 'Failed to process the invoice. Please try again.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [onClose, onPrefill],
  );

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    handleFiles(event.dataTransfer.files);
  };

  const onPick = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    if (inputRef.current) inputRef.current.value = '';
  };

  const stop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const openPicker = () => inputRef.current?.click();

  const acceptLabel = useMemo(() => '.jpg only, up to 5MB', []);

  if (!isOpen) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={() => {
        if (!loading) {
          resetState();
          onClose();
        }
      }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="upload-title" className={styles.title}>
          Upload Invoice
        </h3>
        <p className={styles.subtitle}>
          Drag & drop a JPG here, or choose a file
        </p>

        <div
          className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
          onDragEnter={() => setDragOver(true)}
          onDragOver={stop}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <Button
            type="button"
            className={styles.chooseBtn}
            onClick={openPicker}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Choose JPG'}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            onChange={onPick}
            className={styles.fileInput}
          />
          <div className={styles.hint}>{acceptLabel}</div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => {
              resetState();
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
