// src/hooks/useEmailCheck.ts

import { useState } from 'react';
import useUserStore from '../stores/userStore';

/**
 * ✅ 이메일 중복 확인 커스텀 훅
 * - 사용자가 입력한 이메일의 중복 여부를 서버에 확인
 * - 중복 결과를 내부 상태로 관리 (emailChecked)
 */
export const useEmailCheck = () => {
    // 📌 이메일 중복 확인 여부 상태
    const [emailChecked, setEmailChecked] = useState(false);

    // ✅ Zustand 전역 store에서 이메일 중복 확인 함수 불러오기
    const { checkEmailDuplication } = useUserStore();

    /**
     * 📧 이메일 중복 확인 함수
     * - 입력된 이메일이 빈 문자열인지 확인
     * - 서버에 중복 확인 요청
     * - 응답 결과에 따라 상태 업데이트 및 알림 표시
     *
     * @param email - 사용자 입력 이메일 주소
     * @returns Promise<boolean> - 사용 가능 여부 (true: 사용 가능 / false: 중복)
     */
    const checkEmail = async (email: string): Promise<boolean> => {
        if (!email.trim()) {
            alert("📭 이메일을 입력해주세요.");
            setEmailChecked(false);
            return false;
        }

        try {
            // 서버 중복 확인 요청
            const isAvailable = await checkEmailDuplication(email);

            if (isAvailable) {
                alert("✅ 사용 가능한 이메일입니다.");
                setEmailChecked(true);
                return true;
            } else {
                alert("🚫 이미 사용 중인 이메일입니다.");
                setEmailChecked(false);
                return false;
            }

        } catch (error: any) {
            console.error("❌ 이메일 중복 체크 오류:", error);
            alert(error.message || "⚠️ 이메일 중복 체크 중 오류가 발생했습니다.");
            setEmailChecked(false);
            return false;
        }
    };

    /**
     * 🔄 이메일 중복 확인 상태 초기화
     * - 이메일 입력 값이 변경되었을 때 등 재확인을 위해 사용
     */
    const resetEmailCheck = () => {
        setEmailChecked(false);
    };

    return {
        emailChecked,                     // ✅ 현재 중복 확인 여부
        checkEmailDuplication: checkEmail, // ✅ 이메일 중복 확인 실행 함수
        resetEmailCheck,                 // ✅ 상태 초기화 함수
    };
};
