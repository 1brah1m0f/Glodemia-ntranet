import { useState } from "react";
import { useApp } from "../context";
export default function RevenueChart({ total }) {
  const { t, money } = useApp();
  const [period, setPeriod] = useState("month"),
    [point, setPoint] = useState(null);
  const values =
    period === "week"
      ? [11, 17, 14, 25, 20, 32, 39]
      : period === "year"
        ? [8, 14, 22, 18, 35, 30, 45, 48, 58, 63, 68, 75]
        : [10, 15, 13, 24, 20, 32, 29, 39, 35, 48, 43, 57];
  const max = Math.max(...values);
  const xy = values.map((v, i) => [
    48 + (i * 552) / (values.length - 1),
    170 - (v / max) * 140,
  ]);
  const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const amount =
    period === "week" ? total * 0.26 : period === "year" ? total * 9.4 : total;
  const labels =
    period === "week"
      ? t(
          ["B.e.", "Ç.a.", "Çər.", "C.a.", "Cümə", "Şən.", "Bazar"],
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        )
      : period === "year"
        ? t(
            ["Yan", "Mar", "May", "İyl", "Sen", "Noy"],
            ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
          )
        : t(
            ["1 okt", "6 okt", "11 okt", "16 okt", "21 okt", "31 okt"],
            ["Oct 1", "Oct 6", "Oct 11", "Oct 16", "Oct 21", "Oct 31"],
          );
  return (
    <>
      <div className="revenue-top">
        <div>
          <strong>{money(amount)}</strong>
          <span className="growth">↗ 18.4%</span>
        </div>
        <div className="segmented">
          {[
            ["week", t("Həftə", "Week")],
            ["month", t("Ay", "Month")],
            ["year", t("İl", "Year")],
          ].map(([v, label]) => (
            <button
              key={v}
              aria-pressed={v === period}
              className={v === period ? "active" : ""}
              onClick={() => {
                setPeriod(v);
                setPoint(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="revenue-chart">
        <svg
          viewBox="0 0 630 205"
          role="img"
          aria-label={t("Gəlir dinamikası", "Revenue trend")}
        >
          <defs>
            <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0088b4" stopOpacity=".16" />
              <stop offset="100%" stopColor="#0088b4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 77, 124, 170].map((y, i) => (
            <g key={y}>
              <path d={`M45 ${y}H605`} className="chart-grid" />
              <text x="0" y={y + 4}>
                {money(amount * (1 - i / 3)).replace(/\s?₼/, "")}
              </text>
            </g>
          ))}
          <path d={`${line}L600 170H48Z`} fill="url(#revenue-fill)" />
          <path d={line} className="chart-line" />
          {xy.map(([x, y], i) => (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="13"
                fill="transparent"
                role="img"
                tabIndex="0"
                aria-label={`${i + 1}: ${money((values[i] / max) * amount)}`}
                onFocus={() => setPoint(i)}
                onBlur={() => setPoint(null)}
                onMouseEnter={() => setPoint(i)}
                onMouseLeave={() => setPoint(null)}
              />
              {point === i && (
                <>
                  <path d={`M${x} ${y}V170`} className="chart-guide" />
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#0088b4"
                    stroke="white"
                    strokeWidth="2"
                  />
                </>
              )}
            </g>
          ))}
          {labels.map((l, i) => (
            <text
              key={l}
              x={48 + (i * 552) / (labels.length - 1)}
              y="198"
              textAnchor={i === labels.length - 1 ? "end" : "start"}
            >
              {l}
            </text>
          ))}
        </svg>
        {point !== null && (
          <div className="chart-tooltip">
            {money((values[point] / max) * amount)}
          </div>
        )}
      </div>
      <div className="chart-legend">
        <span>
          <i />
          {t("Toplanmış ödənişlər", "Collected payments")}
        </span>
        <small>{t("Nümunə analitika", "Demo analytics")}</small>
      </div>
    </>
  );
}
