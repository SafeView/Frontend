import { useState } from "react";
import styles from "./AddressInput.module.css";
import AddressSearchModal from "../AddressSearch/AddressSearchModal";
import type { AddressResult } from "../../types/address";

interface AddressInputProps {
  address: string;
  detailAddress: string;
  onAddressChange: (address: string) => void;
  onDetailAddressChange: (detailAddress: string) => void;
}

const AddressInput = ({ 
  address, 
  detailAddress, 
  onAddressChange, 
  onDetailAddressChange 
}: AddressInputProps) => {
  const [showAddressModal, setShowAddressModal] = useState(false);

  const openAddressSearch = () => {
    setShowAddressModal(true);
  };

  const closeAddressSearch = () => {
    setShowAddressModal(false);
  };

  const handleAddressSelect = (addressData: AddressResult) => {
    onAddressChange(addressData.roadAddress);
  };

  return (
    <div className={styles.addressSection}>
      <div className={styles.addressInputWrapper}>
        <input
          className={styles.addressInput}
          placeholder="주소"
          value={address}
          readOnly
        />
        <button
          type="button"
          onClick={openAddressSearch}
          className={styles.addressSearchButton}
        >
          주소 검색
        </button>
      </div>
      <input
        className={styles.detailInput}
        placeholder="상세주소 (선택사항)"
        value={detailAddress}
        onChange={(e) => onDetailAddressChange(e.target.value)}
      />
      
      {/* 주소 검색 모달 */}
      {showAddressModal && (
        <AddressSearchModal
          onClose={closeAddressSearch}
          onSelect={handleAddressSelect}
        />
      )}
    </div>
  );
};

export default AddressInput; 