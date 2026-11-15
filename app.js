const timerEl = document.getElementById("timer");
const statusEl = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const distractBtn = document.getElementById("distractBtn");
const stopBtn = document.getElementById("stopBtn");
const resultEl = document.getElementById("result");

let startTime = null, tick = null;
let distractions = 0;
let lastDistractionAt = null;
let gaps = [];

function fmt(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

startBtn.addEventListener("click", () => {
  startTime = Date.now();
  distractions = 0;
  lastDistractionAt = startTime;
  gaps = [];
  resultEl.classList.add("hidden");
  statusEl.textContent = "در حال تمرکز... هر بار حواست پرت شد، دکمهٔ قرمز رو بزن.";
  startBtn.disabled = true;
  distractBtn.disabled = false;
  stopBtn.disabled = false;

  tick = setInterval(() => {
    const sec = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = fmt(sec);
  }, 250);
});

distractBtn.addEventListener("click", () => {
  const now = Date.now();
  gaps.push((now - lastDistractionAt) / 1000);
  lastDistractionAt = now;
  distractions++;
  statusEl.textContent = `حواس‌پرتی ثبت شد (${distractions}) — ادامه بده.`;
  // افکت لرزش کوتاه
  timerEl.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" },
     { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
    { duration: 200 }
  );
});

stopBtn.addEventListener("click", () => {
  clearInterval(tick);
  const totalSec = Math.floor((Date.now() - startTime) / 1000);
  gaps.push((Date.now() - lastDistractionAt) / 1000);

  // درصد تمرکز: هرچی میانگین فاصلهٔ حواس‌پرتی‌ها بیشتر، تمرکز بالاتر
  const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
  let score = Math.min(100, Math.round((avgGap / 120) * 100)); // ۲ دقیقه = ۱۰۰٪
  if (totalSec < 10) score = Math.min(score, 100);

  const best = Number(localStorage.getItem("focusBest") || 0);
  const newBest = score > best;
  if (newBest) localStorage.setItem("focusBest", score);

  resultEl.innerHTML = `
    <div>⏱ مدت کل: <strong>${fmt(totalSec)}</strong></div>
    <div>✋ حواس‌پرتی: <strong>${distractions}</strong></div>
    <div>📊 درصد تمرکز: <strong>${score}%</strong></div>
    <div>🏆 بهترین رکورد: <strong>${Math.max(best, score)}%</strong> ${newBest ? "🎉 رکورد جدید!" : ""}</div>
  `;
  resultEl.classList.remove("hidden");
  statusEl.textContent = "تمومه. دوباره شروع کن؟";
  startBtn.disabled = false;
  distractBtn.disabled = true;
  stopBtn.disabled = true;
});
