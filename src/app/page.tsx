import styles from "./page.module.css";

export default function Page() {
  return (
    <div className={styles.dashboard}>
      {/* 日付とアクティブ状態 */}
      <div className={styles.headerSection}>
        <div>
          <h2 className={styles.date}>10月3日</h2>
          <p className={styles.activeStatus}>アクティブ状態（65%）</p>
        </div>
        <div className={styles.characterArea}>
          <div className={styles.character}></div>
        </div>
      </div>

      {/* アクティビティカード群 */}
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>睡眠</p>
          <p className={styles.cardValue}>--</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>消費カロリー</p>
          <p className={styles.cardValue}>232 / 500 Kcal</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>歩数</p>
          <p className={styles.cardValue}>6,541 歩</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>アクティブ時間</p>
          <p className={styles.cardValue}>8 / 12 時間</p>
        </div>
      </div>

      {/* 身体指標 */}
      <section className={styles.section}>
        <h3>身体指標</h3>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span>基礎代謝量</span>
            <strong>1,707 Kcal</strong>
          </div>
          <div className={styles.metricCard}>
            <span>有酸素能力</span>
            <strong>--</strong>
          </div>
          <div className={styles.metricCard}>
            <span>血中酸素濃度</span>
            <strong>--</strong>
          </div>
          <div className={styles.metricCard}>
            <span>手首の体温</span>
            <strong>--</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
