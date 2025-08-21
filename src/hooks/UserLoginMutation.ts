// src/hooks/useLoginMutation.ts

import { useMutation } from '@tanstack/react-query';
import type { LoginRequest } from '../types/user';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

/**
 * 🔐 로그인 Mutation 훅
 *
 * ✅ 기능 요약
 * - 로그인 API 호출
 * - 서버에서 받은 HttpOnly 쿠키에 토큰 저장 (응답 본문에 토큰 없음)
 * - Zustand userStore를 통해 전역 user 상태 업데이트
 * - 성공 시 메인 페이지로 리다이렉트
 */

interface UseLoginMutationOptions {
    onSuccess?: () => void;           // ✅ 로그인 성공 후 실행할 콜백 (선택)
    onError?: (error: Error) => void; // ❌ 로그인 실패 시 실행할 콜백 (선택)
}

export const useLoginMutation = (options?: UseLoginMutationOptions) => {
    const navigate = useNavigate();
    const { login } = useUserStore(); // Zustand 전역 상태 관리에서 login 함수 가져옴

    return useMutation({
        /**
         * 📥 로그인 요청 함수
         * - form: { email, password } 형태의 로그인 요청 데이터
         * - 내부에서 API 호출 + user 상태 업데이트
         */
        mutationFn: async (form: LoginRequest): Promise<void> => {
            await login(form);
        },

        /**
         * ✅ 로그인 성공 시 처리
         * - 메인(/)으로 이동
         * - 옵션으로 받은 onSuccess 콜백 실행
         */
        onSuccess: () => {
            alert('🎉 로그인에 성공했습니다!');
            navigate('/');

            if (options?.onSuccess) {
                options.onSuccess();
            }
        },

        /**
         * ❌ 로그인 실패 시 처리
         * - alert로 사용자에게 알림
         * - 콘솔에 에러 메시지 출력
         * - 옵션으로 받은 onError 콜백 실행
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
