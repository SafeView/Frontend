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
 * 🔐 복호화 키 발급 API
 *
 * - 사용자의 요청에 따라 서버에서 새 복호화 키를 생성하거나,
 *   기존 유효한 키가 있으면 그 키를 반환합니다.
 * - 키는 AES-256 기반으로 생성되어 DB 및 블록체인에 기록됩니다.
 *
 * @returns KeyIssueData - 발급된 키 정보 객체 (암호화된 키, 토큰 등 포함)
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const issueKey = async (): Promise<KeyIssueData> => {
    try {
        // POST /decryption/keys 엔드포인트로 키 발급 요청
        const response = await api.post<KeyIssueResponse>('/decryption/keys');

        // 응답이 성공일 경우 → 키 정보 반환
        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            // 응답 실패 → 에러 메시지 포함하여 예외 발생
            throw new Error(response.data.message || '키 발급에 실패했습니다.');
        }
    } catch (error: any) {
        // ❗ 네트워크 에러 또는 서버 응답 오류 핸들링
        throw new Error(
            error.response?.data?.message || '키 발급 중 네트워크 오류가 발생했습니다.'
        );
    }
};

/**
 * 🧪 복호화 키 검증 API
 *
 * - 사용자가 입력한 복호화 키(accessToken)가
 *   해당 영상(cameraId)에 대해 유효한지를 확인합니다.
 * - 유효하면 복호화 권한을 부여하고, 아니라면 오류를 반환합니다.
 *
 * @param body 검증 요청 바디: { accessToken: string, cameraId: string }
 * @returns KeyVerifyData - 검증 결과 정보 (유효 여부, 유효 시간 등)
 * @throws Error - API 실패 또는 네트워크 오류 시 예외 발생
 */
export const verifyKey = async (body: KeyVerifyBody): Promise<KeyVerifyData> => {
    try {
        // POST /decryption/keys/verify 요청 (accessToken + cameraId 전송)
        const response = await api.post<KeyVerifyResponse>('/decryption/keys/verify', body);

        // 응답이 성공일 경우 → 검증 결과 반환
        if (response.data.isSuccess) {
            return response.data.data;
        } else {
            // 실패 시 → 상세 메시지와 함께 예외 발생
            throw new Error(response.data.message || '키 검증에 실패했습니다.');
        }
    } catch (error: any) {
        // ❗ 네트워크 또는 서버 오류 핸들링
        throw new Error(
            error.response?.data?.message || '키 검증 중 네트워크 오류가 발생했습니다.'
        );
    }
};
