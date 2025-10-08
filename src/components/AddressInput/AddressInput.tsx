// src/components/AddressInput/AddressInput.tsx

// ✅ React의 useState 훅을 가져와 상태를 관리
import { useState } from "react";

// ✅ CSS 모듈 import
import styles from "./AddressInput.module.css";

// 🔹 컴포넌트 props 타입 정의
interface AddressInputProps {
    address: string; // 기본 주소
    detailAddress: string; // 상세 주소
    onAddressChange: (address: string) => void; // 주소 변경 콜백
    onDetailAddressChange: (detailAddress: string) => void; // 상세 주소 변경 콜백
}

// 🔹 AddressInput 컴포넌트 정의
const AddressInput = ({
                          address,
                          detailAddress,
                          onAddressChange,
                          onDetailAddressChange
                      }: AddressInputProps) => {
    // 🔸 주소 유효성 검사 (선택 사항)
    const [error, setError] = useState<string | null>(null);

    // 🔹 주소 입력 변경 핸들러
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onAddressChange(value);

        // 간단한 유효성 예시 (너무 짧은 입력 방지)
        if (value.trim().length < 3) {
            setError("주소를 정확히 입력해주세요.");
        } else {
            setError(null);
        }
    };

    return (
        <div className={styles.addressSection}>
            {/* 기본 주소 입력 */}
            <input
                className={styles.addressInput}
                placeholder="주소를 입력하세요"
                value={address}
                onChange={handleAddressChange}
            />

            {/* 상세 주소 입력 */}
            <input
                className={styles.detailInput}
                placeholder="상세주소 (선택사항)"
                value={detailAddress}
                onChange={(e) => onDetailAddressChange(e.target.value)}
            />

            {/* 에러 메시지 표시 */}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

// ✅ 외부에서 사용 가능하도록 export
export default AddressInput;
