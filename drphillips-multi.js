
const scriptURL = 'https://sheetdb.io/api/v1/wr8bptn1wll6e';
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
      nameDiv.className = "signup-name";
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

  fetch(`${scriptURL}/search?date=${selectedDate}&group=${encodeURIComponent(group)}`)
    .then(res => res.json())
    .then(rows => {
if (name === "") {
  console.log("DELETE URL:", `${scriptURL}/date/${selectedDate}/group/${encodeURIComponent(group)}`);
return fetch(`${scriptURL}/date/${selectedDate}/group/${encodeURIComponent(group)}`, {
    method: "DELETE"
  });
}
      }
    })
    .then(() => {
      if (name !== "") {
        return fetch(scriptURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: [{ date: selectedDate, group: group, name: name }] })
        });
      }
    })
    .then(() => {
      if (name !== "") {
        calendarData[selectedDate] = name;
      } else {
        delete calendarData[selectedDate];
      }
      renderCalendar();
    });
}

function loadData() {
  fetch(`${scriptURL}/search?group=${encodeURIComponent(group)}`)
    .then(res => res.json())
    .then(data => {
      calendarData = {};
      const monthPrefix = currentDate.toISOString().slice(0, 7);
      data.forEach(entry => {
        if (entry.date && entry.date.startsWith(monthPrefix)) {
          calendarData[entry.date] = entry.name;
        }
      });
      renderCalendar();
    });
}

window.onload = loadData;
