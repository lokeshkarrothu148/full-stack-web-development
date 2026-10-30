const grid = document.querySelector("#event-grid");
const form = document.querySelector("#event-form");
const searchInput = document.querySelector("#search");
const categoryFilter = document.querySelector("#category-filter");
const sortFilter = document.querySelector("#sort-filter");
const resultCount = document.querySelector("#result-count");
const toast = document.querySelector("#toast");
let events = [];

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function formatDate(date) {
  if (!date) return "Date to be announced";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });
}
function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}
async function api(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Request failed.");
  return payload;
}
async function loadEvents() {
  grid.innerHTML = '<div class="loading">Loading events…</div>';
  try {
    events = await api("/api/events");
    renderEvents();
    renderStats();
  } catch (error) {
    grid.innerHTML = `<div class="empty-state">Could not load events. Make sure the server is running, then refresh this page.<br><small>${escapeHtml(error.message)}</small></div>`;
  }
}
function renderStats() {
  const today = new Date().toISOString().slice(0, 10);
  document.querySelector("#stat-total").textContent = events.length;
  document.querySelector("#stat-registrations").textContent = events.reduce((sum, event) => sum + Number(event.registrations || 0), 0);
  document.querySelector("#stat-upcoming").textContent = events.filter(event => event.date >= today).length;
}
function renderEvents() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  let visible = events.filter(event => {
    const searchable = `${event.title} ${event.location} ${event.description} ${event.category}`.toLowerCase();
    return searchable.includes(query) && (category === "all" || event.category === category);
  });
  if (sortFilter.value === "latest") visible.sort((a, b) => `${b.date}T${b.time}`.localeCompare(`${a.date}T${a.time}`));
  else if (sortFilter.value === "popular") visible.sort((a, b) => (b.registrations || 0) - (a.registrations || 0));
  else visible.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  resultCount.textContent = `${visible.length} event${visible.length === 1 ? "" : "s"} found`;
  if (!visible.length) {
    grid.innerHTML = '<div class="empty-state"><strong>No events found.</strong><br>Try another search or create a new event.</div>';
    return;
  }
  grid.innerHTML = visible.map(event => `
    <article class="event-card">
      <div class="card-top"><span class="category-badge">${escapeHtml(event.category)}</span><span class="date-chip">${escapeHtml(formatDate(event.date))}</span></div>
      <h3>${escapeHtml(event.title)}</h3>
      <p class="event-description">${escapeHtml(event.description || "Join fellow students for this campus event.")}</p>
      <div class="event-meta"><span>◷ ${escapeHtml(event.time)}</span><span>⌖ ${escapeHtml(event.location)}</span></div>
      <div class="card-footer"><span class="registrations">♧ ${Number(event.registrations || 0)} registered</span>
        <div class="card-actions">
          <button class="small-button" data-action="register" data-id="${escapeHtml(event.id)}">Register</button>
          <button class="small-button delete-button" data-action="delete" data-id="${escapeHtml(event.id)}" aria-label="Delete ${escapeHtml(event.title)}">Delete</button>
        </div>
      </div>
    </article>`).join("");
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  const message = document.querySelector("#form-message");
  message.textContent = "";
  message.classList.remove("error");
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  try {
    const data = Object.fromEntries(new FormData(form).entries());
    await api("/api/events", { method: "POST", body: JSON.stringify(data) });
    form.reset();
    message.textContent = "Event published successfully.";
    await loadEvents();
    notify("Your event is live!");
    document.querySelector("#events").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    message.textContent = error.message;
    message.classList.add("error");
  } finally {
    submit.disabled = false;
  }
});
grid.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  button.disabled = true;
  try {
    if (button.dataset.action === "register") {
      const updated = await api(`/api/events/${encodeURIComponent(id)}/register`, {
        method: "PATCH", body: JSON.stringify({ register: true })
      });
      events = events.map(item => item.id === id ? updated : item);
      renderEvents(); renderStats(); notify("Registration added!");
    } else if (button.dataset.action === "delete") {
      if (!window.confirm("Delete this event? This cannot be undone.")) return;
      await api(`/api/events/${encodeURIComponent(id)}`, { method: "DELETE" });
      events = events.filter(item => item.id !== id);
      renderEvents(); renderStats(); notify("Event deleted.");
    }
  } catch (error) {
    notify(error.message);
  } finally {
    button.disabled = false;
  }
});
searchInput.addEventListener("input", renderEvents);
categoryFilter.addEventListener("change", renderEvents);
sortFilter.addEventListener("change", renderEvents);
const dateInput = form.elements.date;
dateInput.min = new Date().toISOString().slice(0, 10);
loadEvents();
