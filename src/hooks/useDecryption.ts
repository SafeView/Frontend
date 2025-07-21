import { useState, useCallback } from 'react';
import { useUserStore } from '../stores/userStore';
import { DecryptService } from '../services/aiService';

interface UseDecryptionReturn {
  showDecryptModal: boolean;
  decryptKey: string;
  decryptError: string;
  isDecrypted: boolean;
  isAdmin: boolean;
  handleDecryptSubmit: () => void;
  handleDecryptClick: () => void;
  setShowDecryptModal: (show: boolean) => void;
  setDecryptKey: (key: string) => void;
}

export const useDecryption = (): UseDecryptionReturn => {
  const { user, isDecrypted, setDecryptionKey, toggleDecryption } = useUserStore();
  const [showDecryptModal, setShowDecryptModal] = useState(false);
  const [decryptKey, setDecryptKey] = useState('');
  const [decryptError, setDecryptError] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  const handleDecryptSubmit = useCallback(() => {
    const validation = DecryptService.validateKey(decryptKey);
    
    if (!validation.valid) {
      setDecryptError(validation.error || '복호화키 검증 실패');
      return;
    }

    const config = DecryptService.getDecryptConfig(decryptKey);
    if (config) {
      setDecryptionKey(decryptKey);
      toggleDecryption();
      setShowDecryptModal(false);
      setDecryptKey('');
      setDecryptError('');
    }
  }, [decryptKey, setDecryptionKey, toggleDecryption]);

  const handleDecryptClick = useCallback(() => {
    if (isDecrypted) {
      toggleDecryption();
    } else {
      setShowDecryptModal(true);
    }
  }, [isDecrypted, toggleDecryption]);

  return {
    showDecryptModal,
    decryptKey,
    decryptError,
    isDecrypted,
    isAdmin,
    handleDecryptSubmit,
    handleDecryptClick,
    setShowDecryptModal,
    setDecryptKey
  };
}; 