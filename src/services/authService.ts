import api from '../lib/axios';

export const signup = async (email: string, password: string, nickname: string) => {
    const response = await api.post('/auth/signup', {
        email,
        password,
        nickname,
    });
    return response.data;
};

export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
        email,
        password,
    });
    return response.data;
};
