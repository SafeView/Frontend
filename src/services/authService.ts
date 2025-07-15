import api from '../lib/axios';


interface LoginResponse {
    token: string;
    email: string;
    nickname: string;
}

interface SignUpResponse {
    token: string;
    email: string;
    nickname: string;
}

interface ApiResponse<T> {
    isSuccess: boolean;
    code: string;
    message: string;
    data: T;
}



export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', {
        email,
        password,
    });
    return response.data.data;
};

export const signup = async (email: string, password: string, nickname: string): Promise<SignUpResponse> => {
    const response = await api.post<ApiResponse<SignUpResponse>>('/auth/signup', {
        email,
        password,
        nickname,
    });
    return response.data.data;
};
