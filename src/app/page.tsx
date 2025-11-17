"use client";

import { useMemo, useState, useRef } from "react";
import styles from "./page.module.css";

type DayItem = { label: string; date: string; isToday?: boolean };
type TabKey = "metrics" | "report" | "articles" | "meal";

type Nutrition = {
  amount_g: number;
  kcal: number;
  protein: number;
  fat: number;
  carb: number;
};

type MealItem = {
  label: string;
  portion_size: "S" | "M" | "L";
  nutrition: Nutrition | null;
};

/** 直近14日を生成（今日を含む） */
function useTwoWeeks(): DayItem[] {
  const now = new Date();
  return useMemo(() => {
    const arr: DayItem[] = [];
    for (let i = -3; i <= 10; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
      const label = `${d.getMonth() + 1}/${d.getDate()}(${w})`;
      arr.push({ label, date: d.toISOString().slice(0, 10), isToday: i === 0 });
    }
    return arr;
  }, [now]);
}

export default function DashboardPage() {
  const days = useTwoWeeks();
  const todayIndex = days.findIndex((d) => d.isToday);
  const [activeDate, setActiveDate] = useState<number>(
    todayIndex >= 0 ? todayIndex : 3
  );

  // 上部タブ（今日ページ専用）
  const [tab, setTab] = useState<TabKey>("metrics");

  // ---- 食事記録（画像アップロード＋解析）用の state ----
  const [mealImageFile, setMealImageFile] = useState<File | null>(null);
  const [mealPreviewUrl, setMealPreviewUrl] = useState<string | null>(null);
  const [mealResults, setMealResults] = useState<MealItem[] | null>(null);
  const [mealLoading, setMealLoading] = useState(false);
  const [mealError, setMealError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectMealPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMealImageFile(file);
    setMealPreviewUrl(URL.createObjectURL(file));
    setMealResults(null);
    setMealError(null);
  };

  const handleOpenCamera = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeMeal = async () => {
    if (!mealImageFile) return;
    setMealLoading(true);
    setMealError(null);

    try {
      const formData = new FormData();
      formData.append("image", mealImageFile);

      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const res = await fetch(`${baseUrl}/api/food/analyze/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("食事画像の解析に失敗しました");
      }

      const data = await res.json();
      setMealResults(data.items as MealItem[]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMealError(err.message);
      } else {
        setMealError("エラーが発生しました");
      }
    } finally {
      setMealLoading(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* ---- 上部：ページ内タブ（今日ページ専用） ---- */}
      <section className={styles.segWrap} aria-label="コンテンツ切替">
        <div
          className={styles.segRow}
          role="tablist"
          aria-label="今日のメニュー"
        >
          <button
            role="tab"
            aria-selected={tab === "metrics"}
            className={`${styles.segBtn} ${
              tab === "metrics" ? styles.segActive : ""
            }`}
            onClick={() => setTab("metrics")}
          >
            健康指標を見る
          </button>
          <button
            role="tab"
            aria-selected={tab === "report"}
            className={`${styles.segBtn} ${
              tab === "report" ? styles.segActive : ""
            }`}
            onClick={() => setTab("report")}
          >
            健康増進レポート
          </button>
          <button
            role="tab"
            aria-selected={tab === "articles"}
            className={`${styles.segBtn} ${
              tab === "articles" ? styles.segActive : ""
            }`}
            onClick={() => setTab("articles")}
          >
            健康記事を読む
          </button>
          <button
            role="tab"
            aria-selected={tab === "meal"}
            className={`${styles.segBtn} ${
              tab === "meal" ? styles.segActive : ""
            }`}
            onClick={() => setTab("meal")}
          >
            食事を記録する
          </button>
        </div>
      </section>

      {/* ---- 日付横スクロール（タブの下） ---- */}
      <section className={styles.dateScroller} aria-label="日付を選択">
        <div className={styles.dateRow}>
          {days.map((d, idx) => (
            <button
              key={d.date}
              className={`${styles.dateChip} ${
                idx === activeDate ? styles.activeChip : ""
              } ${d.isToday ? styles.todayChip : ""}`}
              onClick={() => setActiveDate(idx)}
            >
              <span className={styles.chipLabel}>{d.label}</span>
              {idx === activeDate && (
                <span className={styles.chipDot} aria-hidden />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ---- ヒーロー（キャラクター） ---- */}
      <section className={styles.heroCard}>
        <div className={styles.heroText}>
          <h2 className={styles.heroTitle}>ようこそ！</h2>
          <p className={styles.heroSubtitle}>
            選択中：{days[activeDate]?.label}
          </p>
        </div>
        <div className={styles.heroCharacter} aria-hidden />
      </section>

      {/* ---- タブ別コンテンツ ---- */}
      {tab === "metrics" && (
        <>
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
        </>
      )}

      {tab === "report" && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>健康増進レポート</h3>
          <div className={styles.reportGrid}>
            <div className={styles.reportCard}>
              <div className={styles.reportHeader}>週間サマリー</div>
              <p className={styles.reportText}>
                歩数 +12% / 睡眠 7.1h / 消費 1,820kcal
              </p>
              <div className={styles.fakeChart} />
            </div>
            <div className={styles.reportCard}>
              <div className={styles.reportHeader}>改善ポイント</div>
              <ul className={styles.reportList}>
                <li>就寝時間を 15 分早めましょう</li>
                <li>夕食の炭水化物を控えめに</li>
                <li>日中に 10 分の散歩を追加</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {tab === "articles" && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>おすすめ記事</h3>
          <div className={styles.articleList}>
            <a
              className={styles.articleItem}
              href="#"
              aria-label="記事：睡眠の質を高める3つの習慣"
            >
              <div className={styles.thumb} aria-hidden>
                🛏️
              </div>
              <div className={styles.meta}>
                <p className={styles.articleTitle}>睡眠の質を高める3つの習慣</p>
                <span className={styles.articleInfo}>読む目安 4分</span>
              </div>
            </a>
            <a
              className={styles.articleItem}
              href="#"
              aria-label="記事：1日8,000歩のすすめ"
            >
              <div className={styles.thumb} aria-hidden>
                👟
              </div>
              <div className={styles.meta}>
                <p className={styles.articleTitle}>1日8,000歩のすすめ</p>
                <span className={styles.articleInfo}>読む目安 3分</span>
              </div>
            </a>
            <a
              className={styles.articleItem}
              href="#"
              aria-label="記事：たんぱく質の摂り方入門"
            >
              <div className={styles.thumb} aria-hidden>
                🍗
              </div>
              <div className={styles.meta}>
                <p className={styles.articleTitle}>たんぱく質の摂り方入門</p>
                <span className={styles.articleInfo}>読む目安 5分</span>
              </div>
            </a>
          </div>
        </section>
      )}

      {tab === "meal" && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>食事を記録する</h3>
          <div className={styles.mealCard}>
            <p className={styles.mealText}>
              写真を撮って食事を簡単記録。カロリーや栄養素を自動で概算します。
            </p>

            {/* カメラ / 画像選択ボタン */}
            <div className={styles.mealButtons}>
              <button
                className={styles.primaryBtn}
                type="button"
                onClick={handleOpenCamera}
              >
                カメラで記録
              </button>
              <button
                className={styles.outlineBtn}
                type="button"
                // TODO: 手入力画面に遷移させる場合はここに処理を記述
              >
                手入力
              </button>
            </div>

            {/* 非表示の file input（スマホではカメラが立ち上がる想定） */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleSelectMealPhoto}
              style={{ display: "none" }}
            />

            {/* プレビュー */}
            {mealPreviewUrl && (
              <div className={styles.mealPreview}>
                <p className={styles.mealPreviewLabel}>選択中の写真</p>
                <img
                  src={mealPreviewUrl}
                  alt="食事のプレビュー"
                  className={styles.mealPreviewImage}
                />
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={handleAnalyzeMeal}
                  disabled={mealLoading}
                >
                  {mealLoading ? "解析中..." : "この写真から栄養素を推定する"}
                </button>
              </div>
            )}

            {/* エラー表示 */}
            {mealError && <p className={styles.mealError}>{mealError}</p>}

            {/* 解析結果 */}
            {mealResults && mealResults.length > 0 && (
              <div className={styles.mealResultList}>
                <p className={styles.mealResultTitle}>解析結果</p>
                {mealResults.map((item, idx) => (
                  <div key={idx} className={styles.mealResultCard}>
                    <div className={styles.mealResultHeader}>
                      <span className={styles.mealResultLabel}>
                        {item.label}
                      </span>
                      <span className={styles.mealResultPortion}>
                        量：{item.portion_size}
                      </span>
                    </div>
                    {item.nutrition ? (
                      <ul className={styles.mealNutritionList}>
                        <li>推定量：{item.nutrition.amount_g} g</li>
                        <li>カロリー：{item.nutrition.kcal} kcal</li>
                        <li>タンパク質：{item.nutrition.protein} g</li>
                        <li>脂質：{item.nutrition.fat} g</li>
                        <li>炭水化物：{item.nutrition.carb} g</li>
                      </ul>
                    ) : (
                      <p className={styles.mealNoNutrition}>
                        この料理はまだ栄養データ未登録です。
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
