"use client";

import styles from "./page.module.css";
import { useMemo, useState } from "react";

type DayItem = { label: string; date: string; isToday?: boolean };

function useTwoWeeks(): DayItem[] {
  // 今日を中心に直近14日を生成
  const now = new Date();
  return useMemo(() => {
    const arr: DayItem[] = [];
    for (let i = -3; i <= 10; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
      const label = `${d.getMonth() + 1}/${d.getDate()}(${w})`;
      arr.push({
        label,
        date: d.toISOString().slice(0, 10),
        isToday: i === 0,
      });
    }
    return arr;
  }, [now]);
}

export default function DashboardPage() {
  const days = useTwoWeeks();
  const todayIndex = days.findIndex((d) => d.isToday);
  const [active, setActive] = useState<number>(
    todayIndex >= 0 ? todayIndex : 3
  );

  return (
    <div className={styles.dashboard}>
      {/* --- 上部：日付スクローラ --- */}
      <section className={styles.dateScroller} aria-label="日付を選択">
        <div className={styles.dateRow}>
          {days.map((d, idx) => (
            <button
              key={d.date}
              className={`${styles.dateChip} ${
                idx === active ? styles.activeChip : ""
              } ${d.isToday ? styles.todayChip : ""}`}
              onClick={() => setActive(idx)}
            >
              <span className={styles.chipLabel}>{d.label}</span>
              {idx === active && (
                <span className={styles.chipDot} aria-hidden />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* --- キャラクター & ステータス --- */}
      <section className={styles.heroCard}>
        <div className={styles.heroText}>
          <h2 className={styles.heroTitle}>ようこそ！</h2>
          <p className={styles.heroSubtitle}>選択中：{days[active]?.label}</p>
        </div>
        <div className={styles.heroCharacter} aria-hidden />
      </section>

      {/* --- アクティビティカード --- */}
      <div className={styles.cardGrid}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>睡眠</p>
          <p className={styles.cardValue}>--</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>消費カロリー</p>
          <p className={styles.cardValue}>0 / 500 Kcal</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>歩数</p>
          <p className={styles.cardValue}>70 歩</p>
        </div>
        <div className={styles.card}>
          <p className={styles.cardTitle}>アクティブ時間</p>
          <p className={styles.cardValue}>1 / 12 時間</p>
        </div>
      </div>

      {/* --- 身体指標 --- */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>身体指標</h3>
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
