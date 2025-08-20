// React의 useState 훅을 가져와 상태 관리를 할 수 있게 함
import { useState } from "react";

// CSS 모듈을 import해서 컴포넌트 스타일링에 사용
import styles from "./AddressInput.module.css";

// 주소 검색을 위한 모달 컴포넌트 import
import AddressSearchModal from "../AddressSearch/AddressSearchModal";

// AddressResult 타입을 import (주소 검색 API의 결과 타입으로 추정됨)
import type { AddressResult } from "../../types/address";

// 🔹 컴포넌트 props 타입 정의
interface AddressInputProps {
    address: string; // 현재 선택된 주소
    detailAddress: string; // 상세 주소 (사용자가 입력)
    onAddressChange: (address: string) => void; // 주소가 바뀔 때 실행할 콜백
    onDetailAddressChange: (detailAddress: string) => void; // 상세 주소가 바뀔 때 실행할 콜백
}

// 🔹 AddressInput 컴포넌트 정의 (props 구조 분해 할당 방식으로 받음)
const AddressInput = ({
                          address,
                          detailAddress,
                          onAddressChange,
                          onDetailAddressChange
                      }: AddressInputProps) => {

    // 주소 검색 모달을 보여줄지 여부를 관리하는 상태
    const [showAddressModal, setShowAddressModal] = useState(false);

    // 🔹 모달을 여는 함수
    const openAddressSearch = () => {
        setShowAddressModal(true); // 모달 표시
    };

    // 🔹 모달을 닫는 함수
    const closeAddressSearch = () => {
        setShowAddressModal(false); // 모달 숨김
    };

    // 🔹 주소 선택 시 실행되는 콜백
    const handleAddressSelect = (addressData: AddressResult) => {
        onAddressChange(addressData.roadAddress); // roadAddress 값을 부모로 전달
    };

    // 🔹 컴포넌트 렌더링
    return (
        <div className={styles.addressSection}>
            {/* 주소 입력 필드와 검색 버튼이 포함된 래퍼 */}
            <div className={styles.addressInputWrapper}>
                <input
                    className={styles.addressInput} // 주소 input에 적용할 CSS 클래스
                    placeholder="주소" // placeholder 텍스트
                    value={address} // 현재 선택된 주소를 보여줌
                    readOnly // 사용자가 직접 수정하지 못하도록 readOnly 설정
                />
                <button
                    type="button"
                    onClick={openAddressSearch} // 버튼 클릭 시 모달 오픈
                    className={styles.addressSearchButton}
                >
                    주소 검색
                </button>
            </div>

            {/* 상세 주소 입력 필드 */}
            <input
                className={styles.detailInput}
                placeholder="상세주소 (선택사항)"
                value={detailAddress} // 입력된 상세 주소 값
                onChange={(e) => onDetailAddressChange(e.target.value)} // 입력 시 콜백 실행
            />

            {/* 주소 검색 모달 조건부 렌더링 */}
            {showAddressModal && (
                <AddressSearchModal
                    onClose={closeAddressSearch} // 모달 닫기 핸들러 전달
                    onSelect={handleAddressSelect} // 주소 선택 핸들러 전달
                />
            )}
        </div>
    );
};

// 컴포넌트를 외부에서 사용할 수 있도록 export
export default AddressInput;
