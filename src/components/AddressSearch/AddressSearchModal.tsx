// React 훅 import: 상태 관리를 위한 useState
import { useState } from "react";

// CSS 모듈 import: 모달의 스타일을 관리
import styles from "./AddressSearchModal.module.css";

// AddressResult 타입 import: 검색된 주소 객체의 타입을 정의
import type { AddressResult } from "../../types/address";

// 🔹 props 타입 정의
interface AddressSearchModalProps {
    onClose: () => void; // 모달 닫기 콜백
    onSelect: (address: AddressResult) => void; // 주소 선택 시 콜백
}

// 🔹 주소 검색 모달 컴포넌트
const AddressSearchModal = ({ onClose, onSelect }: AddressSearchModalProps) => {
    // 검색 키워드 입력값
    const [keyword, setKeyword] = useState("");

    // 검색 결과 목록
    const [results, setResults] = useState<AddressResult[]>([]);

    // 로딩 상태 관리 (API 호출 중 여부)
    const [loading, setLoading] = useState(false);

    // 🔹 주소 검색 실행 함수
    const searchAddress = async () => {
        // 입력값이 비어 있으면 경고창 띄우고 중단
        if (!keyword.trim()) {
            alert("검색어를 입력해주세요.");
            return;
        }

        // 로딩 시작
        setLoading(true);

        try {
            // 카카오 주소 검색 API 호출
            const response = await fetch(
                `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(keyword)}`,
                {
                    headers: {
                        // ⛔ 실제 사용 시에는 유효한 REST API 키를 사용해야 함!
                        'Authorization': 'KakaoAK 1234567890abcdef1234567890abcdef',
                    }
                }
            );

            // 응답이 실패한 경우 (예: API 키 무효, CORS 문제 등)
            if (!response.ok) {
                // 임시로 목업 데이터 사용 (실패 시에도 흐름 유지)
                const mockResults: AddressResult[] = [
                    {
                        roadAddress: `${keyword} 123-45`,
                        jibunAddress: `${keyword} 123-45`,
                        zonecode: '12345',
                    },
                    {
                        roadAddress: `${keyword} 678-90`,
                        jibunAddress: `${keyword} 678-90`,
                        zonecode: '67890',
                    },
                ];
                setResults(mockResults);
                return;
            }

            // JSON 응답 파싱
            const data = await response.json();

            // 정상적으로 주소 결과가 존재하는 경우
            if (data.documents && data.documents.length > 0) {
                const addressResults: AddressResult[] = data.documents.map((item: any) => ({
                    roadAddress: item.address_name,         // 도로명 주소
                    jibunAddress: item.address_name,        // 지번 주소 (동일 값 사용 중)
                    zonecode: item.address.zip_code || '00000', // 우편번호 없을 시 기본값
                }));
                setResults(addressResults);
            } else {
                // 결과 없음
                setResults([]);
            }

        } catch (error) {
            // API 호출 중 예외 발생 시
            console.error('주소 검색 오류:', error);

            // 예외 발생 시에도 목업 데이터 제공
            const mockResults: AddressResult[] = [
                {
                    roadAddress: `${keyword} 123-45`,
                    jibunAddress: `${keyword} 123-45`,
                    zonecode: '12345',
                },
                {
                    roadAddress: `${keyword} 678-90`,
                    jibunAddress: `${keyword} 678-90`,
                    zonecode: '67890',
                },
            ];
            setResults(mockResults);
        } finally {
            // 로딩 종료
            setLoading(false);
        }
    };

    // 🔹 주소 선택 시 실행되는 핸들러
    const handleAddressSelect = (addressData: AddressResult) => {
        onSelect(addressData); // 부모 컴포넌트에 선택된 주소 전달
        onClose();             // 모달 닫기
    };

    // 🔹 모달 UI 렌더링
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {/* 모달 상단 영역 (제목 + 닫기 버튼) */}
                <div className={styles.modalHeader}>
                    <h3>주소 검색</h3>
                    <button onClick={onClose} className={styles.closeButton}>
                        ✕
                    </button>
                </div>

                {/* 검색 입력 필드와 버튼 */}
                <div className={styles.searchSection}>
                    <input
                        type="text"
                        placeholder="도로명, 건물명 또는 지번을 입력하세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)} // 입력 시 상태 업데이트
                        className={styles.searchInput}
                        onKeyPress={(e) => e.key === 'Enter' && searchAddress()} // 엔터 키로도 검색 가능
                    />
                    <button
                        onClick={searchAddress}
                        className={styles.searchButton}
                        disabled={loading}
                    >
                        {loading ? '검색중...' : '검색'}
                    </button>
                </div>

                {/* 검색 결과 표시 영역 */}
                <div className={styles.resultsSection}>
                    {results.length > 0 ? (
                        // 결과가 있을 경우: 리스트 렌더링
                        results.map((result, index) => (
                            <div
                                key={index}
                                className={styles.addressItem}
                                onClick={() => handleAddressSelect(result)} // 항목 클릭 시 주소 선택
                            >
                                <div className={styles.roadAddress}>{result.roadAddress}</div>
                                <div className={styles.jibunAddress}>{result.jibunAddress}</div>
                                <div className={styles.zonecode}>[{result.zonecode}]</div>
                            </div>
                        ))
                    ) : (
                        // 결과 없을 경우
                        <div className={styles.noResults}>
                            {loading ? '검색중...' : '검색 결과가 없습니다.'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 컴포넌트를 외부에서 사용할 수 있도록 export
export default AddressSearchModal;
