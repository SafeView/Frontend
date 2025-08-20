// 🔹 Zustand로 관리되는 alert 상태를 불러오기 위한 커스텀 훅 import
import { useAlertStore } from "../../stores/alertStore";

// 🔹 이 테이블 컴포넌트에 적용할 스타일 CSS 모듈 import
import styles from "./AlertTable.module.css";

// 🔹 경고(Alert) 목록을 테이블 형태로 출력하는 컴포넌트
const AlertTable = () => {
    // alertStore에서 alerts 상태 가져오기
    // alerts는 최근 감지된 경고(이상행위 등)의 배열일 것으로 추정됨
    const { alerts } = useAlertStore();

    return (
        <div className={styles.tableWrapper}>
            {/* 제목 표시 */}
            <h2 className={styles.title}>Recent Alerts</h2>

            {/* 테이블 UI 시작 */}
            <table className={styles.table}>
                <thead>
                <tr>
                    {/* 테이블 헤더 정의 */}
                    <th>Timestamp</th>     {/* 경고 발생 시각 */}
                    <th>Camera</th>        {/* 해당 경고가 발생한 카메라 이름 */}
                    <th>Type</th>          {/* 경고 유형 (ex. 침입, 이상행동 등) */}
                    <th>Description</th>   {/* 경고 상세 설명 */}
                </tr>
                </thead>

                <tbody>
                {/* alert 목록을 map으로 순회하며 테이블 행 구성 */}
                {alerts.map((alert, i) => (
                    <tr key={i}>
                        <td>{alert.timestamp}</td>          {/* 발생 시간 */}
                        <td>{alert.camera}</td>             {/* 카메라 이름 */}
                        <td>
                            {/* 타입 강조를 위한 배지 스타일 */}
                            <span className={styles.typeBadge}>{alert.type}</span>
                        </td>
                        <td>{alert.description}</td>        {/* 상세 설명 */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

// 컴포넌트를 외부에서 사용할 수 있도록 export
export default AlertTable;
