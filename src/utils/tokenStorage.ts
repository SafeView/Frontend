// 쿠키 유틸리티 함수들
export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  
  // 쿠키 설정
  private static setCookie(name: string, value: string, days: number = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    
    // HTTPS 환경에서는 Secure 플래그 추가
    if (window.location.protocol === 'https:') {
      cookieString + '; Secure';
    }
    
    document.cookie = cookieString;
  }
  
  // 쿠키 가져오기
  private static getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  // 쿠키 삭제
  private static deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  // Access Token 저장 (1일 만료)
  static setAccessToken(token: string) {
    this.setCookie(this.ACCESS_TOKEN_KEY, token, 1);
  }
  
  // Access Token 가져오기
  static getAccessToken(): string | null {
    return this.getCookie(this.ACCESS_TOKEN_KEY);
  }
  
  // Refresh Token 저장 (7일 만료)
  static setRefreshToken(token: string) {
    this.setCookie(this.REFRESH_TOKEN_KEY, token, 7);
  }
  
  // Refresh Token 가져오기
  static getRefreshToken(): string | null {
    return this.getCookie(this.REFRESH_TOKEN_KEY);
  }
  
  // 모든 토큰 삭제 (로그아웃)
  static clearTokens() {
    this.deleteCookie(this.ACCESS_TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
  }
  
  // 토큰 만료 체크
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
  
  // 인증 헤더 생성
  static getAuthHeaders() {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  
  // 토큰 존재 여부 확인
  static hasToken(): boolean {
    return !!this.getAccessToken();
  }
} 