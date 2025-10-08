
import React, { useState } from "react";
import styles from "./UserInfoModal.module.css";
import useUserStore from "../../stores/userStore";
import type { Gender } from "../../types/user";

interface Props {
    onClose: () => void;
}

const UserInfoModal: React.FC<Props> = ({ onClose }) => {
    const user = useUserStore((state) => state.user);

    // ✅ updateUser 가져오기
    const updateUser = useUserStore((state) => state.updateUser);

    // 기존 값들을 초기 상태로
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [password, setPassword] = useState(""); // 비밀번호는 보안상 빈칸
    const [address, setAddress] = useState(user?.address || "");
    const [gender, setGender] = useState<Gender>(user?.gender || "FEMALE");
    const [birthday, setBirthday] = useState(user?.birthday || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !phone.trim()) {
            alert("이름과 전화번호는 필수입니다.");
            return;
        }

        try {
            // ✅ 실제 API 호출 및 상태 갱신
            await updateUser({
                name,
                phone,
                password: password || undefined, // 비밀번호가 비어있으면 전송 X
                address,
                gender,
                birthday,
            });

            alert("정보가 수정되었습니다.");
            onClose();
        } catch (err) {
            console.error("회원 정보 수정 실패:", err);
            alert("회원 정보 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>회원 정보 수정</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        placeholder="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="전화번호"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="새 비밀번호 (변경 시 입력)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="주소"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />

                    {/* 성별 선택 */}
                    <select
                        className={styles.select}
                        value={gender}
                        onChange={(e) => setGender(e.target.value as Gender)}
                    >
                        <option value="MALE">남성</option>
                        <option value="FEMALE">여성</option>
                    </select>

                    {/* 생년월일 입력 */}
                    <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />

                    <div className={styles.buttonRow}>
                        <button type="submit">저장</button>
                        <button type="button" onClick={onClose}>
                            닫기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserInfoModal;
