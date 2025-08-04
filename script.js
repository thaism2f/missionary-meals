const SHEETDB_URL = 'https://sheetdb.io/api/v1/wr8bptn1wll6e';
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
  loadData();
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  document.getElementById("name").value = "";
  document.getElementById("selected-date-label").innerText = "";

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  document.getElementById("month-title").innerText = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const dateStr = formatDate(dateObj);
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
  document.getElementById("form").style.display = "block";
    };

    calendar.appendChild(cell);
  }
}

function submitForm() {
  if (!selectedDate) return;

  const name = document.getElementById("name").value.trim();

  const payload = {
    date: selectedDate,
    group: group,
    name: name
  };

  // First, check if this date/group already exists
  fetch(`${SHEETDB_URL}/search?date=${selectedDate}&group=${group}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const rowId = data[0].id;
        if (name === "") {
          // Delete if blank
          fetch(`${SHEETDB_URL}/id/${rowId}`, { method: "DELETE" })
        } else {
          // Update existing
          fetch(`${SHEETDB_URL}/id/${rowId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: payload })
          });
        }
      } else {
        if (name !== "") {
          // Create new entry
          fetch(SHEETDB_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: payload })
          });
        }
      }

      calendarData[selectedDate] = name || undefined;
      renderCalendar();
    });
}

function loadData() {
  const monthPrefix = currentDate.toISOString().slice(0, 7); // YYYY-MM
  fetch(`${SHEETDB_URL}/search?group=${group}`)
    .then(res => res.json())
    .then(data => {
      calendarData = {};
      data.forEach(row => {
        if (row.date && row.date.startsWith(monthPrefix)) {
          calendarData[row.date] = row.name;
        }
      });
      renderCalendar();
    });
}

window.onload = loadData;
