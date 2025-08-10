// ✅ 추가: 카메라 컨트롤 컴포넌트 분리
import { FaStop, FaPlay, FaCircle } from "react-icons/fa";
import styles from "../../pages/CameraPage.module.css"; // 경로 상황에 맞게 조정

export type Mode = "live" | "history";

interface CameraControlsProps {
    isRecording: boolean;
    onToggleRecording: () => void;

    mode: Mode;
    onGoLive: () => void;
}

const CameraControls = ({
                            isRecording,
                            onToggleRecording,
                            mode,
                            onGoLive,
                        }: CameraControlsProps) => {
    return (
        <div className={styles.controls}>
            {/* 🎥 녹화 버튼 */}
            <button
                className={`${styles.ctrlBtn} ${isRecording ? styles.activeBtn : ""}`}
                onClick={onToggleRecording}
            >
                {isRecording ? (
                    <>
                        <FaStop className={styles.icon} />
                        녹화 중지
                    </>
                ) : (
                    <>
                        <FaCircle className={styles.icon} />
                        녹화 시작
                    </>
                )}
            </button>

            {/* 🔴 라이브 복귀 버튼 */}
            <button
                className={`${styles.ctrlBtn} ${mode === "live" ? styles.disabledBtn : ""}`}
                onClick={onGoLive}
                disabled={mode === "live"}
            >
                <FaPlay className={styles.icon} />
                LIVE
            </button>
        </div>
    );
};

export default CameraControls;
