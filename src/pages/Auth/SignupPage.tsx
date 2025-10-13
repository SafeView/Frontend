// src/pages/Auth/SignupPage.tsx

import React, { useState } from "react";
import styles from "./SignupPage.module.css";
import { useSignupMutation } from "../../hooks/UserSignupMutation.ts";
import { useEmailCheck } from "../../hooks/useEmailCheck.ts";
import AddressInput from "../../components/AddressInput/AddressInput.tsx";
import type { Gender } from "../../types/user.ts";
import useUserStore from "../../stores/userStore.ts";

/**
 * 📝 회원가입 페이지 컴포넌트
 * - 사용자 정보 입력
 * - 이메일 중복 체크
 * - 회원가입 요청
 */
const SignupPage = () => {
    // 🔤 입력값 상태 관리
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState<Gender>("FEMALE");
    const [birthday, setBirthday] = useState("");

    // 이메일 인증 관련 상태
    const [verificationCode, setVerificationCode] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailAuthMessage, setEmailAuthMessage] = useState('');

    // 이메일 중복 체크 훅
    const { emailChecked, checkEmailDuplication, resetEmailCheck } = useEmailCheck();

    // 회원가입 요청 훅
    const signupMutation = useSignupMutation();

    // userStore에서 메서드 가져오기
    const { sendEmailVerificationCode, verifyEmailCode } = useUserStore();

    /**
     * 📧 이메일 입력 핸들러
     * - 값 변경 시 중복 체크 상태 초기화
     */
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        resetEmailCheck();
    };

    /**
     * 🧾 회원가입 제출 핸들러
     * - 유효성 검사 후 회원가입 API 호출
     */
    const handleSignup = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        // ✅ 유효성 검사
        if (!emailChecked) {
            alert("이메일 중복 체크를 먼저 해주세요.");
            return;
        }
        if (!email.includes("@")) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }
        /**
         * ✅ 비밀번호 유효성 검사
         * - 8자 이상
         * - 소문자 포함
         * - 숫자 포함
         * - 특수문자 포함
         * 각 조건을 세분화하여 구체적인 에러 메시지 출력
         */
        if (password.length < 8) {
            alert("비밀번호는 최소 8자 이상이어야 합니다.");
            return;
        }
        if (!/[a-z]/.test(password)) {
            alert("비밀번호에 소문자가 최소 1자 이상 포함되어야 합니다.");
            return;
        }
        if (!/\d/.test(password)) {
            alert("비밀번호에 숫자가 최소 1자 이상 포함되어야 합니다.");
            return;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            alert("비밀번호에 특수문자가 최소 1자 이상 포함되어야 합니다.");
            return;
        }
        if (name.trim() === "") {
            alert("이름은 필수 입력 항목입니다.");
            return;
        }
        if (!address.trim()) {
            alert("주소를 입력해주세요.");
            return;
        }
        if (!phone.trim()) {
            alert("전화번호는 필수 입력 항목입니다.");
            return;
        }
        if (!/^\d+$/.test(phone)) { // 🔧 수정: 숫자만 허용 검사
            alert("전화번호는 숫자만 입력 가능합니다.");
            return;
        }
        if (!gender) {
            alert("성별을 선택해주세요.");
            return;
        }
        if (!birthday.trim()) {
            alert("생년월일을 입력해주세요.");
            return;
        }

        // 🏠 전체 주소 결합
        const fullAddress = detailAddress ? `${address} ${detailAddress}` : address;

        // ✅ 회원가입 요청 실행
        signupMutation.mutate({
            email,
            password,
            name,
            address: fullAddress,
            // role: "USER",
            phone,
            gender,
            birthday
        });
        console.log('[Debug] 회원가입 요청 보냄', {
            email,
            password,
            name,
            address: fullAddress,
            // role: "USER",
            phone,
            gender,
            birthday
        })
    };

    /**
     * ✉️ 이메일 인증 코드 전송
     */
    const handleSendVerification = async () => {
        console.log('[Debug] 인증번호 발송 버튼 클릭됨'); // 🔍 추가
        if (!email.includes('@')) {
            alert("유효한 이메일을 입력해주세요.");
            return;
        }

        try {
            const msg = await sendEmailVerificationCode(email);
            setEmailSent(true);
            setEmailAuthMessage(msg);
        } catch (err: any) {
            setEmailAuthMessage(err.message || "이메일 전송 실패");
        }
    };

    /**
     * ✅ 인증번호 확인 핸들러
     */
    const handleVerifyCode = async () => {
        if (!verificationCode) {
            alert("인증번호를 입력해주세요.");
            return;
        }

        try {
            const verify = {email , code: verificationCode}
            const msg = await verifyEmailCode(verify);
            setEmailVerified(true);
            setEmailAuthMessage(msg); // 예: "인증 완료"
        } catch (err: any) {
            setEmailAuthMessage(err.message || "인증 실패");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sign Up</h1>

            {/* 회원가입 폼 */}
            <form onSubmit={handleSignup} className={styles.form}>
                {/* 이메일 입력 + 중복체크 + 인증 */}
                <div className={styles.emailInputWrapper}>
                    <div className={styles.emailRow}>
                        <input
                            className={styles.emailInput}
                            placeholder="이메일"
                            value={email}
                            onChange={handleEmailChange}
                            type="email"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => checkEmailDuplication(email)}
                            className={styles.emailButton}
                        >
                            중복 체크
                        </button>
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    onClick={handleSendVerification}*/}
                        {/*    className={styles.emailButton}*/}
                        {/*    disabled={!emailChecked}*/}
                        {/*>*/}
                        {/*    인증 발송*/}
                        {/*</button>*/}
                    </div>
                </div>

                {/* 🔐 인증코드 입력 + 인증 확인 */}
                {emailSent && (
                    <>
                        <div className={styles.emailInputWrapper}>
                            <input
                                className={styles.emailInput}
                                placeholder="인증번호 입력"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleVerifyCode}
                                className={styles.checkButton}
                            >
                                인증 확인
                            </button>
                        </div>
                        {emailAuthMessage && (
                            <p className={styles.verificationMessage}>{emailAuthMessage}</p>
                        )}
                    </>
                )}

                {/* 비밀번호 입력 */}
                <input
                    className={styles.input}
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* 이름 입력 */}
                <input
                    className={styles.input}
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                {/* 📦 주소 입력 컴포넌트 */}
                <AddressInput
                    address={address}
                    detailAddress={detailAddress}
                    onAddressChange={setAddress}
                    onDetailAddressChange={setDetailAddress}
                />

                {/* 전화번호 입력 */}
                <input
                    className={styles.input}
                    placeholder="전화번호 (숫자만)"
                    value={phone}
                    onChange={(e) => {
                        // 🔧 수정: 숫자만 남기고 자동 필터링
                        const onlyNums = e.target.value.replace(/\D/g, "");
                        setPhone(onlyNums);
                    }}
                    maxLength={11} // 🔧 수정: 11자리 제한 (01012345678 형식)
                    required
                />

                {/* 성별 선택 */}
                <select
                    className={styles.input}
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                >
                    <option value="">성별 선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                </select>

                {/* 생년월일 입력 */}
                <input
                    className={styles.input}
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />

                {/* 회원가입 버튼 */}
                {/* ❗️비인증 상태면 회원가입 막기 */}
                <button
                    className={styles.button}
                    type="submit"
                    // disabled={signupMutation.isPending || !emailVerified}
                    disabled={signupMutation.isPending}
                >
                    {signupMutation.isPending ? '회원가입 중...' : '회원가입'}
                </button>
            </form>
        </div>
    );
};

export default SignupPage;
