// src/hooks/useSignupMutation.ts

import { useMutation } from '@tanstack/react-query';
import type { SignupRequest } from '../types/user';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../stores/userStore';

/**
 * 🔐 회원가입 Mutation 훅
 *
 * ✅ 기능 요약
 * - 회원가입 요청을 서버에 전송
 * - 성공 시 자동 로그인 처리 (Zustand userStore 내부에서 수행)
 * - 상태 저장소에서 로그인 정보 유지
 * - 성공 시 메인 페이지로 이동
 */

interface UseSignupMutationOptions {
    onSuccess?: () => void;           // ✅ 회원가입 성공 후 실행할 콜백
    onError?: (error: Error) => void; // ❌ 회원가입 실패 시 실행할 콜백
}

export const useSignupMutation = (options?: UseSignupMutationOptions) => {
    const navigate = useNavigate();
    const { signup } = useUserStore(); // Zustand에서 signup 함수 가져오기

    return useMutation({
        /**
         * 📥 회원가입 요청 함수
         * - form: { email, password, name, ... }
         * - 내부에서 자동 로그인 처리까지 수행됨
         */
        mutationFn: async (form: SignupRequest): Promise<void> => {
            await signup(form);
        },

        /**
         * ✅ 회원가입 성공 시 처리
         * - 자동 로그인 후 메인 페이지(/)로 이동
         * - onSuccess 콜백 실행
         */
        onSuccess: () => {
            alert('🎉 회원가입 및 자동 로그인 완료!');
            navigate('/');

            if (options?.onSuccess) {
                options.onSuccess();
            }
        },

        /**
         * ❌ 회원가입 실패 시 처리
         * - alert로 에러 메시지 출력
         * - 콘솔에 에러 출력
         * - onError 콜백 실행
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
