import { useState } from "react";
import styles from "./SignupPage.module.css";
import { useSignupMutation } from "../../hooks/UserSignupMutation.ts";
import { useEmailCheck } from "../../hooks/useEmailCheck.ts";
import AddressInput from "../../components/AddressInput/AddressInput.tsx";
import type { Gender } from "../../types/user.ts";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<Gender>("FEMALE");
  const [birthday, setBirthday] = useState("");

  const { emailChecked, checkEmailDuplication, resetEmailCheck } = useEmailCheck();

  // 회원가입 뮤테이션 훅 사용
  const signupMutation = useSignupMutation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    resetEmailCheck(); // 이메일 변경 시 중복 체크 상태 초기화
  };

  const handleSignup = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!emailChecked) {
      alert("이메일 중복 체크를 먼저 해주세요.");
      return;
    }
    if (!address) {
      alert("주소를 입력해주세요.");
      return;
    }

    const fullAddress = detailAddress ? `${address} ${detailAddress}` : address;

    // 뮤테이션 실행
    signupMutation.mutate({
      email,
      password,
      name,
      address: fullAddress,
      phone,
      gender,
      birthday
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>

      <form onSubmit={handleSignup} className={styles.form}>
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

        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className={styles.input}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* 주소 입력 컴포넌트 */}
        <AddressInput
          address={address}
          detailAddress={detailAddress}
          onAddressChange={setAddress}
          onDetailAddressChange={setDetailAddress}
        />

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

        {/* 생년월일 */}
        <input
          className={styles.input}
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
        />

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
