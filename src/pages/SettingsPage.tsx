import { useState } from 'react';
import styles from './SettingsPage.module.css';

const tabs = ['계정 정보', '시스템 설정', '알림 설정'];

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>⚙️ Settings</h1>
            <p className={styles.subtitle}>시스템 및 계정 관련 설정을 수정할 수 있습니다.</p>

            <div className={styles.tabMenu}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={styles.tabContent}>
                {activeTab === '계정 정보' && (
                    <>
                        <h3>🙋‍♂️ 계정 정보</h3>
                        <label>이름</label>
                        <input type="text" placeholder="홍길동" />
                        <label>이메일</label>
                        <input type="email" placeholder="user@example.com" />
                        <label>비밀번호 변경</label>
                        <input type="password" placeholder="새 비밀번호" />
                        <button className={styles.saveButton}>저장</button>
                    </>
                )}

                {activeTab === '시스템 설정' && (
                    <>
                        <h3>🖥 시스템 설정</h3>
                        <label>테마</label>
                        <select>
                            <option>다크 모드</option>
                            <option>라이트 모드</option>
                        </select>
                        <label>언어</label>
                        <select>
                            <option>한국어</option>
                            <option>English</option>
                        </select>
                        <button className={styles.saveButton}>저장</button>
                    </>
                )}

                {activeTab === '알림 설정' && (
                    <>
                        <h3>🔔 알림 설정</h3>
                        <label>
                            <input type="checkbox" checked />
                            실시간 알림 받기
                        </label>
                        <label>
                            알림 민감도
                            <input type="range" min="1" max="10" defaultValue="5" />
                        </label>
                        <button className={styles.saveButton}>저장</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
