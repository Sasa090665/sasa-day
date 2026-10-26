// System Configurations
let defaultPass = "1234";
let base64Image = "";

// Confetti FX on Form Submission
function triggerCelebration() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Handle Image Selection and Convert to Base64
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      base64Image = e.target.result;
      const preview = document.getElementById('imgPreview');
      preview.src = base64Image;
      preview.style.display = 'block';
      document.getElementById('uploadText').innerText = "تم اختيار الصورة بنجاح!";
    }
    reader.readAsDataURL(file);
  }
}

// Submit Greeting Form
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('senderName').value;
  const text = document.getElementById('messageText').value;

  const newMessage = {
    id: Date.now(),
    name: name,
    text: text,
    image: base64Image,
    date: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })
  };

  // Get Existing Data
  const existing = JSON.parse(localStorage.getItem('birthday_messages') || '[]');
  existing.unshift(newMessage);
  localStorage.setItem('birthday_messages', JSON.stringify(existing));

  // Reset Form
  document.getElementById('greetingForm').reset();
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('uploadText').innerText = "اضغط هنا لرفع صورة تجمعنا أو صورة المعايدة";
  base64Image = "";

  // Show Success Alert & Confetti
  triggerCelebration();
  const alert = document.getElementById('successAlert');
  alert.style.display = 'block';
  setTimeout(() => alert.style.display = 'none', 4000);
}

// Modal Handlers
function openLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function verifyPassword() {
  const passInput = document.getElementById('adminPassword').value;
  if (passInput === defaultPass) {
    closeModal('loginModal');
    document.getElementById('adminPassword').value = '';
    openAdminDashboard();
  } else {
    alert('الرقم السري غير صحيح!');
  }
}

// Load and Display Messages for Admin
function openAdminDashboard() {
  const modal = document.getElementById('adminModal');
  const container = document.getElementById('messagesList');
  const messages = JSON.parse(localStorage.getItem('birthday_messages') || '[]');

  if (messages.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fa-regular fa-envelope-open" style="font-size: 2rem; margin-bottom: 10px;"></i><br>لا توجد رسائل مكتوبة حتى الآن</div>`;
  } else {
    container.innerHTML = messages.map(msg => `
      <div class="msg-card">
        <div class="msg-header">
          <span class="msg-author">${escapeHtml(msg.name)}</span>
          <span class="msg-time">${msg.date}</span>
        </div>
        <div class="msg-text">${escapeHtml(msg.text)}</div>
        ${msg.image ? `<img src="${msg.image}" class="msg-img" onclick="window.open('${msg.image}')" title="اضغط للتكبير">` : ''}
        <div>
          <button class="delete-btn" onclick="deleteMessage(${msg.id})">
            <i class="fa-solid fa-trash-can"></i> مسح الرسالة
          </button>
        </div>
      </div>
    `).join('');
  }

  modal.style.display = 'flex';
}

function deleteMessage(id) {
  let messages = JSON.parse(localStorage.getItem('birthday_messages') || '[]');
  messages = messages.filter(m => m.id !== id);
  localStorage.setItem('birthday_messages', JSON.stringify(messages));
  openAdminDashboard();
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}