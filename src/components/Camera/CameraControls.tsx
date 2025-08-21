// ✅ 아이콘 컴포넌트 import (FontAwesome 기반)
import { FaStop, FaPlay, FaCircle } from "react-icons/fa";

// 카메라 제어 관련 스타일 가져오기
import styles from "../../pages/CameraPage.module.css"; // 스타일 경로는 페이지 기준으로 설정됨

// 🔹 라이브/히스토리 모드 타입 정의
export type Mode = "live" | "history";

// 🔹 컴포넌트 Props 타입 정의
interface CameraControlsProps {
    isRecording: boolean;            // 현재 녹화 중인지 여부
    onToggleRecording: () => void;  // 녹화 시작/중지 토글 핸들러

    mode: Mode;                     // 현재 모드 (라이브 or 히스토리)
    onGoLive: () => void;           // 라이브 모드로 복귀하는 핸들러
}

// 🔹 카메라 컨트롤 UI 컴포넌트 정의
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
                // 버튼 기본 스타일 + 녹화 중이면 강조 스타일 적용
                className={`${styles.ctrlBtn} ${isRecording ? styles.activeBtn : ""}`}
                onClick={onToggleRecording} // 클릭 시 녹화 상태 토글
            >
                {isRecording ? (
                    // 🔴 녹화 중일 때는 중지 버튼 UI로 표시
                    <>
                        <FaStop className={styles.icon} />
                        녹화 중지
                    </>
                ) : (
                    // ⭕ 녹화 중이 아닐 때는 시작 버튼 UI로 표시
                    <>
                        <FaCircle className={styles.icon} />
                        녹화 시작
                    </>
                )}
            </button>

            {/* 🔴 LIVE 버튼 - 기록 재생 모드일 때만 활성화됨 */}
            <button
                // LIVE 버튼은 현재 모드가 live이면 비활성화
                className={`${styles.ctrlBtn} ${mode === "live" ? styles.disabledBtn : ""}`}
                onClick={onGoLive}
                disabled={mode === "live"} // live 상태에서는 클릭 비활성화
            >
                <FaPlay className={styles.icon} />
                LIVE
            </button>
        </div>
    );
};

// 컴포넌트 export
export default CameraControls;
