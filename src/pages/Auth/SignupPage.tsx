// src/pages/Auth/SignupPage.tsx

import React, { useState } from "react";
import styles from "./SignupPage.module.css";
import { useSignupMutation } from "../../hooks/UserSignupMutation.ts";
import { useEmailCheck } from "../../hooks/useEmailCheck.ts";
import AddressInput from "../../components/AddressInput/AddressInput.tsx";
import type { Gender } from "../../types/user.ts";

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

    // ✅ 이메일 중복 체크 훅
    const { emailChecked, checkEmailDuplication, resetEmailCheck } = useEmailCheck();

    // ✅ 회원가입 요청 훅
    const signupMutation = useSignupMutation();

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
        if (password.length < 8) {
            alert("비밀번호는 8자 이상이어야 합니다.");
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
            role: "USER",
            phone,
            gender,
            birthday
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sign Up</h1>

            {/* 회원가입 폼 */}
            <form onSubmit={handleSignup} className={styles.form}>

                {/* 이메일 입력 + 중복 체크 버튼 */}
                <div className={styles.emailInputWrapper}>
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
                        className={styles.checkButton}
                    >
                        중복 체크
                    </button>
                </div>

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
                    placeholder="전화번호"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                <button
                    className={styles.button}
                    type="submit"
                    disabled={signupMutation.isPending}
                >
                    {signupMutation.isPending ? '회원가입 중...' : '회원가입'}
                </button>
            </form>
        </div>
    );
};

export default SignupPage;
