import { useMutation } from '@tanstack/react-query';
import { signup as signupApi } from '../apis/userApi';
import type { SignupRequest, SignupResponse } from '../types/user';
import { useNavigate } from 'react-router-dom';

interface UseSignupMutationOptions {
  onSuccess?: (data: SignupResponse) => void;
  onError?: (error: Error) => void;
}

export const useSignupMutation = (options?: UseSignupMutationOptions) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (userData: SignupRequest): Promise<SignupResponse> => {
      return await signupApi(userData);
    },
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
      
      // 기본 성공 처리
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login');
      
      // 커스텀 성공 콜백 실행
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error) => {
      console.error('회원가입 실패:', error);
      
      // 기본 에러 처리
      alert(error.message || '회원가입에 실패했습니다.');
      
      // 커스텀 에러 콜백 실행
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
};

 