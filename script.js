const maskPassword = (pass) => '*'.repeat(pass.length);

function copyText(txt) {
  navigator.clipboard.writeText(txt).then(() => {
    document.getElementById("alert").style.display = "inline";
    setTimeout(() => {
      document.getElementById("alert").style.display = "none";
    }, 2000);
  }, () => alert("Clipboard copying failed"));
}

function deletePassword(website) {
  let data = JSON.parse(localStorage.getItem("passwords")) || [];
  const updated = data.filter(item => item.website !== website);
  localStorage.setItem("passwords", JSON.stringify(updated));
  alert(`Successfully deleted ${website}'s password`);
  showPasswords();
}

function showPasswords() {
  const tableBody = document.getElementById("password-table");
  let data = JSON.parse(localStorage.getItem("passwords")) || [];
  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="4" class="text-center p-4">No Data To Show</td></tr>`;
    return;
  }

  tableBody.innerHTML = data.map(item => `
    <tr class="border-t border-gray-300 dark:border-gray-600">
      <td class="p-3">${item.website} <img onclick="copyText('${item.website}')" src="./copy.svg" alt="Copy" class="inline w-4 h-4 ml-2 cursor-pointer"/></td>
      <td class="p-3">${item.username} <img onclick="copyText('${item.username}')" src="./copy.svg" alt="Copy" class="inline w-4 h-4 ml-2 cursor-pointer"/></td>
      <td class="p-3">${maskPassword(item.password)} <img onclick="copyText('${item.password}')" src="./copy.svg" alt="Copy" class="inline w-4 h-4 ml-2 cursor-pointer"/></td>
      <td class="p-3"><button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deletePassword('${item.website}')">Delete</button></td>
    </tr>
  `).join('');
}

document.getElementById("password-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const website = document.getElementById("website").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const data = JSON.parse(localStorage.getItem("passwords")) || [];
  data.push({ website, username, password });
  localStorage.setItem("passwords", JSON.stringify(data));
  alert("Password Saved");
  showPasswords();
  e.target.reset();
  document.getElementById("strength").innerText = "";
});

// Password strength
const strengthIndicator = document.getElementById("strength");
document.getElementById("password").addEventListener("input", function () {
  const val = this.value;
  let strength = "";
  if (val.length < 6) {
    strength = "Weak";
    strengthIndicator.className = "text-red-500";
  } else if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(val)) {
    strength = "Medium";
    strengthIndicator.className = "text-yellow-500";
  } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val)) {
    strength = "Strong";
    strengthIndicator.className = "text-green-500";
  } else {
    strength = "Medium";
    strengthIndicator.className = "text-yellow-500";
  }
  strengthIndicator.innerText = `Strength: ${strength}`;
});

// Toggle dark mode
document.getElementById("toggleDark").addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
});

// About modal logic
document.getElementById("aboutBtn").addEventListener("click", () => {
  document.getElementById("aboutModal").classList.remove("hidden");
});
function closeAbout() {
  document.getElementById("aboutModal").classList.add("hidden");
}

showPasswords();
