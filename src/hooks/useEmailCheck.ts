// src/hooks/useEmailCheck.ts
import { useState } from 'react';
import useUserStore from '../stores/userStore';

/**
 * ✅ 이메일 중복 확인 훅
 * - 이메일 입력 여부 검증
 * - 서버와의 중복 확인 API 호출
 * - 결과에 따라 이메일 사용 가능 여부 상태 업데이트
 */
export const useEmailCheck = () => {
  const [emailChecked, setEmailChecked] = useState(false); // 이메일 중복 여부 저장
  const { checkEmailDuplication } = useUserStore(); // Zustand store에서 함수 가져오기

  /**
   * 📧 이메일 중복 확인 함수
   * @param email - 사용자 입력 이메일
   * @returns 중복 여부 (true: 사용 가능, false: 사용 중)
   */
  const checkEmail = async (email: string): Promise<boolean> => {
    if (!email.trim()) {
      alert("📭 이메일을 입력해주세요.");
      setEmailChecked(false);
      return false;
    }

    try {
      const isAvailable = await checkEmailDuplication(email); // ✅ Zustand 내 함수 호출

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
   * 🔄 이메일 중복 상태 초기화
   */
  const resetEmailCheck = () => {
    setEmailChecked(false);
  };

  return {
    emailChecked,
    checkEmailDuplication: checkEmail,
    resetEmailCheck,
  };
};
