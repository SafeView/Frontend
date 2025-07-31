import { useState } from 'react';
import { useUserStore } from '../stores/userStore';

export const useEmailCheck = () => {
  const [emailChecked, setEmailChecked] = useState(false);
  const { checkEmail } = useUserStore();

  const checkEmailDuplication = async (email: string) => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return false;
    }
    
    try {
      const isAvailable = await checkEmail(email);
      
      if (isAvailable) {
        alert("사용 가능한 이메일입니다.");
        setEmailChecked(true);
        return true;
      } else {
        alert("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
        return false;
      }
    } catch (error: any) {
      alert(error.message || "이메일 중복 체크 실패");
      setEmailChecked(false);
      return false;
    }
  };

  const resetEmailCheck = () => {
    setEmailChecked(false);
  };

  return {
    emailChecked,
    checkEmailDuplication,
    resetEmailCheck
  };
}; 