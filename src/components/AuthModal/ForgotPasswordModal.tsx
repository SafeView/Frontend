// src/components/Auth/ForgotPasswordModal.tsx
import { useState } from 'react';
import styles from './ForgotPasswordModal.module.css';
import { sendTempPassword } from '../../services/userService.ts';

interface Props {
    onClose: () => void;
}

const ForgotPasswordModal: React.FC<Props> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSend = async () => {
        if (!email) {
            alert('이메일을 입력해주세요.');
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const msg = await sendTempPassword(email);
            setMessage(msg);
        } catch (error: any) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>비밀번호 재설정</h2>
                <p>가입한 이메일 주소를 입력해 주세요.</p>
                <input
                    className={styles.input}
                    type="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    className={styles.button}
                    onClick={handleSend}
                    disabled={loading}
                >
                    {loading ? '전송 중...' : '임시 비밀번호 전송'}
                </button>
                {message && <p className={styles.message}>{message}</p>}
                <button
                    className={styles.cancelButton}
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;
