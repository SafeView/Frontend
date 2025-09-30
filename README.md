# 🎥 SafeView Frontend
**AI 기반 CCTV 영상 모자이크 및 복호화 키 기반 열람 시스템 - 프론트엔드 애플리케이션**

---

## 📋 목차
- [프로젝트 개요](#-프로젝트-개요)
- [주요 특징](#-주요-특징)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [주요 기능](#-주요-기능)
- [실행 방법](#-실행-방법)
- [환경 설정](#-환경-설정)
- [보안](#-보안)
- [개발 가이드](#-개발-가이드)
- [라이선스](#-라이선스)
- [기여 방법](#-기여-방법)
- [기술 데모](#-기술-데모)

---

## 🎯 프로젝트 개요
**SafeView**는 CCTV 영상에서 인물의 얼굴을 자동으로 모자이크 처리하고,  
공인은 복호화 키를 통해 원본을 복원할 수 있도록 설계된 **AI 기반 보안 플랫폼**입니다.  
React + TypeScript + Zustand 기반의 프론트엔드에서 사용자 편의성과 직관적인 UI/UX를 제공합니다.

---

## ✨ 주요 특징
- 🧠 **AI 얼굴 모자이크**: 실시간 얼굴 탐지 및 모자이크 처리
- 🔑 **복호화 키 기반 원본 열람**: 관리자/공인만 키를 통해 원본 영상 확인 가능
- 🧾 **역할 기반 UI/UX 분기**: 사용자, 중간관리자, 관리자 별로 화면 자동 분기
- 🗃️ **단일 파일 구조 저장**: 영상 + 암호화 정보 통합 저장 지원
- 🌐 **GDPR 및 개인정보보호법 준수**
- 🏢 **스마트시티, 상업시설, 공공기관 등에 적용 가능**

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | ⚛️ React 18, 🌀 TypeScript, ⚡ Vite |
| **상태 관리** | 🪄 Zustand |
| **스타일링** | 🎨 CSS Modules |
| **데이터 요청** | 🔗 Axios |
| **정적 검사** | 🧹 ESLint, ✨ Prettier |
| **개발 환경** | 📦 Node.js |
| **AI 분석 연동** | 🧠 YOLO 기반 AI 영상 분석 API |

---

## 📁 프로젝트 구조

```
.
├── public/               # 정적 파일 (favicon 등)
├── src/
│   ├── assets/           # 이미지, 폰트 등 정적 자원
│   ├── components/       # 재사용 가능한 UI 컴포넌트
│   │   ├── Camera/       # 카메라 기능 컴포넌트
│   │   └── Analysis/     # 분석 결과 출력 컴포넌트
│   ├── pages/            # 라우팅 페이지
│   ├── services/         # API 요청 함수 모듈
│   ├── stores/           # Zustand 상태 관리
│   ├── types/            # 타입 정의
│   ├── styles/           # 전역 스타일 정의
│   ├── App.tsx           # 루트 컴포넌트
│   └── main.tsx          # 앱 엔트리 포인트
├── .eslintrc.cjs         # ESLint 설정
├── .prettierrc           # Prettier 설정
├── tsconfig.json         # TypeScript 설정
├── vite.config.ts        # Vite 설정
└── README.md             # 설명서
```

---

## 🚀 주요 기능

1. **사용자 인증/인가**
    - 로그인 / 로그아웃
    - 회원가입
    - 사용자 역할 기반 UI 분기 (USER / MODERATOR / ADMIN)

2. **영상 업로드 및 분석**
    - 파일 업로드 후 미리보기 제공
    - 시간 입력 기반 분석 요청 → 얼굴 탐지 결과 확인
    - AI 분석 서버 연동 (`/face-detection` API)

3. **영상 목록 조회 및 다운로드**
    - 사용자 별 영상 히스토리 확인
    - 관리자/중간관리자는 전체 영상 열람
    - 원본 파일은 키 검증 후 다운로드 가능

4. **복호화 키 입력 및 검증**
    - 키 발급/검증 모달 UI
    - 올바른 키 입력 시 원본 영상 열람 가능

---

## 🧪 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 빌드 (배포용)
npm run build
```

---

## ⚙️ 환경 설정

`.env` 파일에 아래와 같은 항목을 설정해야 합니다:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_AI_SERVER_URL=http://localhost:5000
VITE_AI_SERVER_API_KEY=your-ai-server-api-key
```

---

## 🔒 보안

- **토큰 기반 인증**: Access Token은 HttpOnly 쿠키를 통해 안전하게 저장
- **역할 기반 접근 제어**: 관리자/사용자 별 기능 제한 및 UI 분리
- **복호화 키 입력**: 원본 영상 접근은 별도 키 인증을 통해 제한
- **CORS 및 HTTPS 고려**: 백엔드 서버와의 안전한 통신을 위한 CORS 설정 포함

---

## 👨‍💻 개발 가이드

- **코딩 컨벤션**: 기능별로 디렉토리 분리, ESLint + Prettier 적용
- **주석 작성**: 컴포넌트 및 서비스 로직에 주요 주석 작성
- **커밋 메시지**: Conventional Commit 스타일 권장 (e.g., `feat:`, `fix:`, `chore:`)

---

## 📝 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

---

## 🤝 기여 방법

```bash
# 1. 레포 Fork
# 2. 기능 브랜치 생성
git checkout -b feature/YourFeatureName

# 3. 커밋
git commit -m "feat: Your feature description"

# 4. 원격 Push
git push origin feature/YourFeatureName

# 5. Pull Request 생성
```

---

## 🎥 기술 데모

- 얼굴 자동 모자이크
- 복호화 키를 통한 원본 열람
- 사용자 권한에 따른 화면 분기

📺 [기술 데모 영상 보기](https://youtu.be/X5nI4CyZd9s)
