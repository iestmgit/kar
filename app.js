const MOODS = [
  { emoji: "😞", value: 1 },
  { emoji: "😕", value: 2 },
  { emoji: "😐", value: 3 },
  { emoji: "🙂", value: 4 },
  { emoji: "😄", value: 5 },
];

const STORAGE_KEY = "mood-journal";
const picker = document.getElementById("moodPicker");
const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const chart = document.getElementById("chart");
const entriesList = document.getElementById("entries");
const todayDate = document.getElementById("todayDate");

let selectedMood = null;

// تاریخ امروز
todayDate.textContent = new Intl.DateTimeFormat("fa-IR", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
}).format(new Date());

// ساخت دکمه‌های حال‌وهوا
MOODS.forEach((m) => {
  const btn = document.createElement("button");
  btn.className = "mood";
  btn.textContent = m.emoji;
  btn.dataset.value = m.value;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mood").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedMood = m;
  });
  picker.appendChild(btn);
});

// ذخیره
saveBtn.addEventListener("click", () => {
  if (!selectedMood) {
    alert("اول یه حال‌وهوا انتخاب کن 🙂");
    return;
  }
  const entry = {
    emoji: selectedMood.emoji,
    value: selectedMood.value,
    note: noteInput.value.trim(),
    date: new Date().toISOString(),
  };
  const data = load();
  data.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  noteInput.value = "";
  render();
});

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function render() {
  const data = load().slice(-30);

  // نمودار
  chart.innerHTML = "";
  data.forEach((d) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${(d.value / 5) * 100}%`;
    bar.title = `${d.emoji} — ${new Intl.DateTimeFormat("fa-IR").format(new Date(d.date))}`;
    chart.appendChild(bar);
  });

  // لیست
  entriesList.innerHTML = "";
  [...data].reverse().forEach((d) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="emoji">${d.emoji}</span>
      <span class="note">${d.note || "—"}</span>
      <span class="date">${new Intl.DateTimeFormat("fa-IR").format(new Date(d.date))}</span>
    `;
    entriesList.appendChild(li);
  });
}

render();
