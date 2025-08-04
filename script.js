
const API_URL = "https://script.google.com/macros/s/AKfycbxfTExGG4B46tg1sC3vd_oYsRzdPM2F3m47pBsO648mUxaB10Dc34zlzmB9peuYVj51/exec";

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  if (typeof GROUP_NAME !== "undefined") {
    loadCalendar(currentMonth, currentYear);
  }
});

function changeMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  loadCalendar(currentMonth, currentYear);
}

function loadCalendar(month, year) {
  const calendar = document.getElementById("calendar");
  const monthYear = document.getElementById("monthYear");
  calendar.innerHTML = "";
  monthYear.textContent = new Date(year, month).toLocaleString("pt-BR", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].forEach(day => {
    const th = document.createElement("th");
    th.textContent = day;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < firstDay || date > daysInMonth) {
        cell.textContent = "";
      } else {
        const cellDate = new Date(year, month, date).toISOString().split("T")[0];
        const span = document.createElement("span");
        span.textContent = date;
        cell.appendChild(span);
        cell.classList.add("clickable");
        cell.onclick = () => {
          const name = prompt("Digite seu nome para " + cellDate + " (deixe em branco para remover):");
          if (name !== null) {
            fetch(API_URL, {
              method: "POST",
              body: JSON.stringify({ date: cellDate, name: name.trim(), group: GROUP_NAME }),
            }).then(() => loadCalendar(month, year));
          }
        };
        date++;
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  calendar.appendChild(table);

  fetch(`${API_URL}?group=${encodeURIComponent(GROUP_NAME)}&month=${year}-${String(month + 1).padStart(2, '0')}`)
    .then(res => res.json())
    .then(data => {
      const cells = calendar.querySelectorAll("td");
      cells.forEach(cell => {
        const dateSpan = cell.querySelector("span");
        if (dateSpan) {
          const cellDate = new Date(year, month, parseInt(dateSpan.textContent)).toISOString().split("T")[0];
          if (data[cellDate]) {
            const nameDiv = document.createElement("div");
            nameDiv.textContent = "🍽 " + data[cellDate];
            nameDiv.className = "name";
            cell.appendChild(nameDiv);
          }
        }
      });
    });
}
