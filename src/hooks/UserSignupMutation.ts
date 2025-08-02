// src/hooks/useSignupMutation.ts

import { useMutation } from '@tanstack/react-query';
import type { SignupRequest } from '../types/user';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

interface UseSignupMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}


/**
 * ✅ 회원가입 Mutation 훅
 * - Zustand의 userStore.signup() 호출 (자동 로그인까지 포함됨)
 */
export const useSignupMutation = (options?: UseSignupMutationOptions) => {
  const navigate = useNavigate();
  const { signup } = useUserStore(); // 상태 저장소에서 signup 함수 가져옴

  return useMutation({
    /**
     * 📝 회원가입 요청
     * - 성공 시 자동 로그인 수행
     */
    mutationFn: async (form: SignupRequest): Promise<void> => {
      await signup(form); // 내부에서 login까지 자동 수행됨
    },

    /**
     * ✅ 성공 시 처리
     * - 로그인 상태로 홈으로 이동
     * - 커스텀 콜백 실행
     */
    onSuccess: () => {
      alert('🎉 회원가입 및 자동 로그인 완료!');
      navigate('/');

      if (options?.onSuccess) {
        options.onSuccess();
      }
    },

    /**
     * ❌ 에러 처리
     * - alert로 메시지 출력
     * - 콜백 실행
     */
    onError: (error: Error) => {
      console.error('❌ 회원가입 실패:', error.message);
      alert(error.message || '회원가입 중 오류가 발생했습니다.');

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
