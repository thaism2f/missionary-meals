
const scriptURL = 'https://script.google.com/macros/s/AKfycbxfTExGG4B46tg1sC3vd_oYsRzdPM2F3m47pBsO648mUxaB10Dc34zlzmB9peuYVj51/exec';
const group = "Elders Dr Phillips";

let currentDate = new Date();
let selectedDate = null;
let calendarData = {};

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function goHome() {
  window.location.href = "index.html";
}

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  renderCalendar();
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  document.getElementById("name").value = "";
  document.getElementById("selected-date-label").innerText = "";

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  document.getElementById("month-title").innerText = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, month, day));
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerText = day;

    if (calendarData[dateStr]) {
      const nameDiv = document.createElement("div");
      nameDiv.innerText = "🍽 " + calendarData[dateStr];
      cell.appendChild(nameDiv);
    }

    cell.onclick = () => {
      selectedDate = dateStr;
      document.getElementById("selected-date-label").innerText = "Selected: " + selectedDate;
      document.getElementById("name").value = calendarData[dateStr] || "";
    };

    calendar.appendChild(cell);
  }
}

function submitForm() {
  if (!selectedDate) return;

  const name = document.getElementById("name").value;

  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify({ date: selectedDate, name: name, group: group })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === "success") {
      if (name.trim() === "") {
        delete calendarData[selectedDate];
      } else {
        calendarData[selectedDate] = name;
      }
      renderCalendar();
    }
  });
}

function loadData() {
  const month = currentDate.toISOString().substring(0, 7);
  fetch(`${scriptURL}?group=${encodeURIComponent(group)}&month=${month}`)
    .then(response => response.json())
    .then(data => {
      calendarData = data;
      renderCalendar();
    });
}

window.onload = loadData;
