// Navigation logic
function showPage(pageId) {
  const pages = [
    "pageHome",
    "pageAdd",
    "pageAbout",
    "pageContact",
    "pageFAQ"
  ];
  pages.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
  const showEl = document.getElementById(pageId);
  if (showEl) showEl.classList.remove("hidden");
  if (pageId === "pageHome") {
    renderPasswords();
  }
}
document.getElementById("navHome").onclick = () => showPage("pageHome");
document.getElementById("navAdd").onclick = () => showPage("pageAdd");
document.getElementById("navAbout").onclick = () => showPage("pageAbout");
document.getElementById("navContact").onclick = () => showPage("pageContact");
document.getElementById("navFAQ").onclick = () => showPage("pageFAQ");
showPage("pageHome");

// Dark mode toggle
const toggleDarkBtn = document.getElementById("toggleDark");
if (toggleDarkBtn) {
  toggleDarkBtn.onclick = function () {
    document.documentElement.classList.toggle("dark");
    // Also toggle dark classes on body for Tailwind
    document.body.classList.toggle("dark:bg-gray-900");
    document.body.classList.toggle("dark:text-gray-100");
    // Save preference
    localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  };
}
// On load, apply theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
  document.body.classList.add("dark:bg-gray-900", "dark:text-gray-100");
} else {
  document.documentElement.classList.remove("dark");
  document.body.classList.remove("dark:bg-gray-900", "dark:text-gray-100");
}

// Toast notification with animation
function showToast(msg, color = "bg-green-600") {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = `fixed top-5 right-5 z-50 ${color} text-white px-4 py-2 rounded shadow show`;
  setTimeout(() => toast.classList.remove("show"), 1800);
}

// Password manager logic
function getPasswords() {
  return JSON.parse(localStorage.getItem("passwords") || "[]");
}
function setPasswords(passwords) {
  localStorage.setItem("passwords", JSON.stringify(passwords));
}
function renderPasswords(filter = "") {
  const table = document.getElementById("password-table");
  const emptyState = document.getElementById("emptyState");
  table.innerHTML = "";
  let passwords = getPasswords();
  if (filter) {
    passwords = passwords.filter(
      entry =>
        entry.website.toLowerCase().includes(filter) ||
        entry.username.toLowerCase().includes(filter)
    );
  }
  if (passwords.length === 0) {
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  } else {
    if (emptyState) emptyState.classList.add("hidden");
  }
  passwords.forEach((entry, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-2 border">${entry.website}</td>
      <td class="p-2 border">${entry.username}</td>
      <td class="p-2 border flex items-center gap-2">
        <input type="password" value="${entry.password}" class="password-field bg-transparent outline-none w-24" readonly />
        <button class="show-btn text-lg" title="Show/Hide">👁️</button>
        <img src="assets/copy.png" alt="Copy" class="w-5 h-5 cursor-pointer copy-btn" data-password="${entry.password}" title="Copy password" />
      </td>
      <td class="p-2 border">
        <button class="bg-yellow-500 text-white px-2 py-1 rounded edit-btn" data-idx="${idx}">Edit</button>
      </td>
      <td class="p-2 border">
        <button class="bg-red-500 text-white px-2 py-1 rounded delete-btn" data-idx="${idx}">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });

  // Copy to clipboard
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.onclick = function () {
      navigator.clipboard.writeText(this.dataset.password);
      showToast("Password copied!");
    };
  });

  // Delete password
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = function () {
      const idx = parseInt(this.dataset.idx);
      const passwords = getPasswords();
      passwords.splice(idx, 1);
      setPasswords(passwords);
      renderPasswords(document.getElementById("search").value.trim().toLowerCase());
      showToast("Deleted!", "bg-red-600");
    };
  });

  // Edit password
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = function () {
      const idx = parseInt(this.dataset.idx);
      openEditModal(idx);
    };
  });

  // Show/hide password
  document.querySelectorAll(".show-btn").forEach((btn, i) => {
    btn.onclick = function () {
      const input = table.querySelectorAll(".password-field")[i];
      input.type = input.type === "password" ? "text" : "password";
      btn.textContent = input.type === "password" ? "👁️" : "🙈";
    };
  });
}
document.getElementById("search").addEventListener("input", function () {
  renderPasswords(this.value.trim().toLowerCase());
});

// Fix: Add Password form - ensure correct field references
const form = document.getElementById("password-form");
if (form) {
  form.onsubmit = function (e) {
    e.preventDefault();
    const website = document.getElementById("website").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (!website || !username || !password) return;
    const passwords = getPasswords();
    passwords.push({ website, username, password });
    setPasswords(passwords);
    form.reset();
    renderPasswords();
    showPage("pageHome");
    showToast("Password added!");
  };
}

// Password strength indicator and bar
const passwordInput = document.getElementById("password");
const strengthDiv = document.getElementById("strength");
const strengthBar = document.getElementById("strengthBar");
if (passwordInput && strengthDiv && strengthBar) {
  passwordInput.addEventListener("input", function () {
    updateStrength(passwordInput.value, strengthDiv, strengthBar);
  });
}
function updateStrength(val, el, barEl) {
  let strength = "Weak";
  let color = "text-red-500";
  let width = "33%";
  let bg = "#f87171";
  if (val.length > 8 && /[A-Z]/.test(val) && /\d/.test(val) && /[^A-Za-z0-9]/.test(val)) {
    strength = "Strong";
    color = "text-green-500";
    width = "100%";
    bg = "#34d399";
  } else if (val.length > 5) {
    strength = "Medium";
    color = "text-yellow-500";
    width = "66%";
    bg = "#fbbf24";
  }
  el.textContent = val ? `Strength: ${strength}` : "";
  el.className = `text-xs mt-1 ${color}`;
  if (barEl) {
    barEl.style.width = val ? width : "0";
    barEl.style.background = bg;
  }
}

// Password generator
document.getElementById("genPass").onclick = function () {
  const pass = generatePassword(12);
  passwordInput.value = pass;
  updateStrength(pass, strengthDiv, strengthBar);
};

// Password generator function
function generatePassword(length = 12) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=<>?";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }
  return pass;
}

// Export passwords
document.getElementById("exportBtn").onclick = function () {
  const data = JSON.stringify(getPasswords(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "passwords.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Exported!");
};

// Import passwords
document.getElementById("importInput").onchange = function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    try {
      const imported = JSON.parse(evt.target.result);
      if (Array.isArray(imported)) {
        setPasswords(imported);
        renderPasswords();
        showToast("Imported!");
      } else {
        showToast("Invalid file!", "bg-red-600");
      }
    } catch {
      showToast("Invalid file!", "bg-red-600");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
};

// Edit modal logic with animation and strength bar
function openEditModal(idx) {
  const passwords = getPasswords();
  const entry = passwords[idx];
  document.getElementById("editIdx").value = idx;
  document.getElementById("editWebsite").value = entry.website;
  document.getElementById("editUsername").value = entry.username;
  document.getElementById("editPassword").value = entry.password;
  const modal = document.getElementById("editModal");
  modal.classList.add("show");
  modal.classList.remove("hidden");
  updateStrength(entry.password, document.getElementById("editStrength"), document.getElementById("editStrengthBar"));
}
document.getElementById("editCancel").onclick = function () {
  const modal = document.getElementById("editModal");
  modal.classList.remove("show");
  setTimeout(() => modal.classList.add("hidden"), 300);
};
document.getElementById("editShowPass").onclick = function () {
  const input = document.getElementById("editPassword");
  input.type = input.type === "password" ? "text" : "password";
  this.textContent = input.type === "password" ? "👁️" : "🙈";
};
const editPasswordInput = document.getElementById("editPassword");
const editStrengthDiv = document.getElementById("editStrength");
const editStrengthBar = document.getElementById("editStrengthBar");
if (editPasswordInput && editStrengthDiv && editStrengthBar) {
  editPasswordInput.addEventListener("input", function () {
    updateStrength(editPasswordInput.value, editStrengthDiv, editStrengthBar);
  });
}
document.getElementById("editForm").onsubmit = function (e) {
  e.preventDefault();
  const idx = parseInt(document.getElementById("editIdx").value);
  const website = document.getElementById("editWebsite").value.trim();
  const username = document.getElementById("editUsername").value.trim();
  const password = document.getElementById("editPassword").value;
  if (!website || !username || !password) return;
  const passwords = getPasswords();
  passwords[idx] = { website, username, password };
  setPasswords(passwords);
  renderPasswords(document.getElementById("search").value.trim().toLowerCase());
  const modal = document.getElementById("editModal");
  modal.classList.remove("show");
  setTimeout(() => modal.classList.add("hidden"), 300);
  showToast("Password updated!");
};

// Add show/hide password logic for Add Password form (with span as eye icon)
const showPassSpan = document.getElementById("showPass");
if (showPassSpan && passwordInput) {
  showPassSpan.onclick = function () {
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      showPassSpan.textContent = "🙈";
    } else {
      passwordInput.type = "password";
      showPassSpan.textContent = "👁️";
    }
  };
}