import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../apis/auth';
import type { LoginRequest, LoginResponse } from '../types/user';
import { useNavigate } from 'react-router-dom';
import { TokenStorage } from '../utils/tokenStorage';
import { useUserStore } from '../stores/userStore';

interface UseLoginMutationOptions {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
}

export const useLoginMutation = (options?: UseLoginMutationOptions) => {
  const navigate = useNavigate();
  const setUserData = useUserStore((state) => state.setUserData);

  return useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<LoginResponse> => {
      return await loginApi(credentials);
    },
    onSuccess: (data) => {
      console.log('로그인 성공:', data);
      
      // 토큰을 쿠키에 저장
      TokenStorage.setAccessToken(data.token);
      
      // userStore에 사용자 데이터 설정
      setUserData({
        email: data.email,
        nickname: data.name,
        name: data.name,
        role: 'USER'
      }, data.token);
      
      // 기본 성공 처리
      alert('로그인되었습니다!');
      navigate('/');
      
      // 커스텀 성공 콜백 실행  
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error: Error) => {
      console.error('로그인 실패:', error);
      
      // 기본 에러 처리
      alert(error.message || '로그인에 실패했습니다.');
      
      // 커스텀 에러 콜백 실행
      if (options?.onError) {
        options.onError(error);
      }
    },
  });
}; 