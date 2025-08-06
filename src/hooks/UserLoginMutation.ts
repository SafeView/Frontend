// src/hooks/useLoginMutation.ts
import { useMutation } from '@tanstack/react-query';
import type { LoginRequest } from '../types/user';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

interface UseLoginMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * ✅ 로그인 Mutation 훅
 * - 로그인 요청 후 쿠키에 토큰 저장됨 (응답 본문에는 토큰 없음)
 * - Zustand의 userStore.login() 호출
 */
export const useLoginMutation = (options?: UseLoginMutationOptions) => {
  const navigate = useNavigate();
  const { login } = useUserStore(); // Zustand에서 로그인 함수 가져옴

  return useMutation({
    /**
     * 🔐 로그인 요청
     * - form: 로그인 폼 데이터 (email, password)
     * - HttpOnly 쿠키에 자동 저장됨
     */
    mutationFn: async (form: LoginRequest): Promise<void> => {
      await login(form); // 내부에서 user 정보도 가져와 상태에 저장
    },

    /**
     * ✅ 성공 시 처리
     * - 메인 화면으로 이동
     * - 커스텀 콜백 있으면 실행
     */
    onSuccess: () => {
      alert('🎉 로그인에 성공했습니다!');
      navigate('/');

      if (options?.onSuccess) {
        options.onSuccess();
      }
    },

    /**
     * ❌ 실패 시 처리
     * - alert로 메시지 표시
     * - 콘솔에도 로그
     */
    onError: (error: Error) => {
      console.error('❌ 로그인 실패:', error.message);
      alert(error.message || '로그인 중 오류가 발생했습니다.');

      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};
