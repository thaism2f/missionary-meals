
const SHEETDB = 'https://sheetdb.io/api/v1/wr8bptn1wll6e';
const GROUP = "Elders Dr Phillips";

let currentDate = new Date();
let selectedDate = null;
let calendarData = {};

// Format YYYY-MM-DD without timezone issues
function ymdFromParts(y, m0, d) {
  const m = String(m0 + 1).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function goHome() { window.location.href = "index.html"; }

function changeMonth(delta) {
  currentDate.setMonth(currentDate.getMonth() + delta);
  loadData();
}

function renderCalendar() {
  const cal = document.getElementById("calendar");
  cal.innerHTML = "";
  document.getElementById("name").value = "";
  document.getElementById("selected-date-label").innerText = "";

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  document.getElementById("month-title").innerText =
    currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // prepend empty cells
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day empty";
    cal.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = ymdFromParts(year, month, day);
    const cell = document.createElement("div");
    cell.className = "day";
    cell.innerHTML = `<div>${day}</div>`;

    if (calendarData[dateStr]) {
      const nameDiv = document.createElement("div");
      nameDiv.className = "signup-name";
      nameDiv.textContent = "🍽 " + calendarData[dateStr];
      cell.appendChild(nameDiv);
    }

    cell.onclick = () => {
      selectedDate = dateStr;
      document.getElementById("selected-date-label").innerText = "Selected: " + selectedDate;
      document.getElementById("name").value = calendarData[dateStr] || "";
      document.getElementById("form").style.display = "block";
    };

    cal.appendChild(cell);
  }
}

function submitForm() {
  if (!selectedDate) return;
  const name = document.getElementById("name").value.trim();

  // 1) Find existing rows for this date + group
  fetch(`${SHEETDB}/search?date=${selectedDate}&group=${encodeURIComponent(GROUP)}`)
    .then(r => r.json())
    .then(rows => {
      if (rows.length > 0) {
        // Update existing (PATCH). If clearing, set name=""
        return fetch(`${SHEETDB}/date/${selectedDate}/group/${encodeURIComponent(GROUP)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [{ name: name }] })
        });
      } else {
        if (name === "") return Promise.resolve(); // nothing to add
        // Create new
        return fetch(SHEETDB, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [{ date: selectedDate, group: GROUP, name: name }] })
        });
      }
    })
    .then(() => loadData()) // refresh from DB so UI matches
    .catch(err => console.error("Submit error:", err));
}

function loadData() {
  const monthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}`;

  fetch(`${SHEETDB}/search?group=${encodeURIComponent(GROUP)}`)
    .then(r => r.json())
    .then(rows => {
      calendarData = {};
      rows.forEach(row => {
        if (row.date && row.date.startsWith(monthPrefix) && row.name && row.name.trim() !== "") {
          calendarData[row.date] = row.name;
        }
      });
      renderCalendar();
    })
    .catch(err => console.error("Load error:", err));
}

window.onload = loadData;
