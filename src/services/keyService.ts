// 복호화 키 발급 및 검증 관련 API 호출 함수 모음입니다.
// 각 함수는 강력한 예외처리와 상세한 주석을 포함합니다.

import api from '../apis/api';
import type {
  KeyIssueResponse,
  KeyIssueData,
  KeyVerifyBody,
  KeyVerifyResponse,
  KeyVerifyData,
} from '../types/key';

/**
 * 복호화 키를 발급받습니다.
 * @returns KeyIssueData - 발급된 키 정보
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const issueKey = async (): Promise<KeyIssueData> => {
  try {
    const response = await api.post<KeyIssueResponse>('/decryption/keys');
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '키 발급에 실패했습니다.');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || '키 발급 중 네트워크 오류가 발생했습니다.'
    );
  }
};

/**
 * 복호화 키를 검증합니다.
 * @param body accessToken, cameraId
 * @returns KeyVerifyData - 검증 결과 정보
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const verifyKey = async (body: KeyVerifyBody): Promise<KeyVerifyData> => {
  try {
    const response = await api.post<KeyVerifyResponse>('/decryption/keys/verify', body);
    if (response.data.isSuccess) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || '키 검증에 실패했습니다.');
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || '키 검증 중 네트워크 오류가 발생했습니다.'
    );
  }
};
