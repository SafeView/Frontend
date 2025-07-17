import { useState } from "react";
import styles from "./SignupPage.module.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/userStore.ts";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);

  const { signup } = useUserStore();
  const navigate = useNavigate();

  // 이메일 중복 체크 함수 (가상 예시, 실제는 API 호출 필요)
  const checkEmailDuplication = async () => {
    if (!email) {
      alert("이메일을 입력하세요.");
      return;
    }
    try {
      // 예시: API 호출하여 중복 여부 확인
      // const response = await fetch(`/api/check-email?email=${email}`);
      // const result = await response.json();

      // 여기서는 임의로 중복 아님(true)으로 가정
      const result = { available: true };

      if (result.available) {
        alert("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      } else {
        alert("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
      }
    } catch (error) {
      alert("이메일 중복 체크 실패");
      setEmailChecked(false);
    }
  };

  const handleSignup = async () => {
    if (!emailChecked) {
      alert("이메일 중복 체크를 먼저 해주세요.");
      return;
    }
    try {
      await signup(email, password, name);
      alert("회원가입 완료!");
      navigate("/");
    } catch (e) {
      alert("회원가입 실패!");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Sign Up</h1>

        <div style={{ display: "flex", alignItems: "center", maxWidth: 280 }}>
          <input
            className={styles.input}
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChecked(false); // 이메일 변경 시 중복 체크 상태 초기화
            }}
            style={{ flex: 1, marginRight: "8px" }}
          />
          <button
            type="button"
            onClick={checkEmailDuplication}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#646cff",
              color: "white",
              cursor: "pointer",
              fontSize: "1rem",
            }}
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
        />
        <input
          className={styles.input}
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={styles.input}
          placeholder="주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
          onChange={(e) => setGender(e.target.value)}
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

        <button className={styles.button} onClick={handleSignup}>
          회원가입
        </button>
      </div>
    </>
  );
};

export default SignupPage;
