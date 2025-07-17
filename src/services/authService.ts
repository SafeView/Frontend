import api from "../lib/axios";

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

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
    email,
    password,
  });
  return response.data.data;
};

export const signup = async (form: {
  email: string;
  password: string;
  name: string;
  address: string;
  phone: string;
  gender: string;
  birthday: string;
}): Promise<SignUpResponse> => {
  const response = await api.post<ApiResponse<SignUpResponse>>(
    "/auth/signup",
    form
  );
  return response.data.data;
};
