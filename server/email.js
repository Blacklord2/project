const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((err) => {
  if (err) console.error('❌ Email transporter error:', err.message);
  else     console.log('✅ Email transporter ready');
});

/* ─── Templates ──────────────────────────────────────────────────────────── */

function loginEmailHtml(fullName, email, time) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f6fb;margin:0;padding:0}
    .c{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(30,40,80,.10)}
    .h{background:linear-gradient(135deg,#1a2f6e 0%,#1a4f6e 50%,#1a6e5a 100%);padding:36px 32px 28px;text-align:center}
    .logo{font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px}
    .logo span{opacity:.7;font-size:13px;display:block;font-weight:400;margin-top:2px}
    .b{padding:32px}
    .g{font-size:20px;font-weight:700;color:#1a2f6e;margin-bottom:12px}
    .t{font-size:15px;color:#4a5568;line-height:1.7;margin-bottom:16px}
    .box{background:#f0f4ff;border-left:4px solid #1a2f6e;border-radius:8px;padding:16px 20px;margin:20px 0}
    .row{font-size:14px;color:#2d3748;margin:4px 0}
    .row strong{color:#1a2f6e}
    .warn{font-size:13px;color:#e53e3e;margin-top:16px}
    .f{background:#f7f9fc;padding:20px 32px;text-align:center;font-size:12px;color:#a0aec0;border-top:1px solid #e2e8f0}
  </style></head><body>
  <div class="c">
    <div class="h"><div class="logo">DB<span>DoBetter — Organize Your Life</span></div></div>
    <div class="b">
      <div class="g">New Login Detected 🔐</div>
      <p class="t">Hi <strong>${fullName}</strong>, we noticed a new sign-in to your DoBetter account.</p>
      <div class="box">
        <div class="row"><strong>Account:</strong> ${email}</div>
        <div class="row"><strong>Time:</strong> ${time}</div>
      </div>
      <p class="t">If this was you, no action is needed. If you didn't sign in, please change your password immediately.</p>
      <p class="warn">⚠️ If you did not perform this login, secure your account right away.</p>
    </div>
    <div class="f">© ${new Date().getFullYear()} DoBetter. All rights reserved.</div>
  </div></body></html>`;
}

function reminderEmailHtml(fullName, activity) {
  const [sh, sm] = activity.startTime.split(':').map(Number);
  const [eh, em] = activity.endTime.split(':').map(Number);
  const mins = (eh * 60 + em) - (sh * 60 + sm);
  const duration = mins > 0 ? ` (${mins} min)` : '';

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <style>
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f4f6fb;margin:0;padding:0}
    .c{max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(30,40,80,.10)}
    .h{background:linear-gradient(135deg,#1a2f6e 0%,#1a4f6e 50%,#1a6e5a 100%);padding:36px 32px 28px;text-align:center}
    .logo{font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px}
    .logo span{opacity:.7;font-size:13px;display:block;font-weight:400;margin-top:2px}
    .b{padding:32px}
    .g{font-size:20px;font-weight:700;color:#1a2f6e;margin-bottom:12px}
    .t{font-size:15px;color:#4a5568;line-height:1.7;margin-bottom:16px}
    .card{background:#f0f4ff;border-radius:12px;padding:20px 24px;margin:20px 0;border:1px solid #c3d0f0}
    .ct{font-size:18px;font-weight:700;color:#1a2f6e;margin-bottom:8px}
    .cm{font-size:14px;color:#4a5568;margin:4px 0}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;background:#e0e7ff;color:#3730a3;margin-top:8px;text-transform:capitalize}
    .f{background:#f7f9fc;padding:20px 32px;text-align:center;font-size:12px;color:#a0aec0;border-top:1px solid #e2e8f0}
  </style></head><body>
  <div class="c">
    <div class="h"><div class="logo">DB<span>DoBetter — Organize Your Life</span></div></div>
    <div class="b">
      <div class="g">⏰ Activity Reminder — 5 Minutes Away!</div>
      <p class="t">Hi <strong>${fullName}</strong>, your upcoming activity is starting soon. Get ready!</p>
      <div class="card">
        <div class="ct">${activity.title}</div>
        ${activity.description ? `<div class="cm">📝 ${activity.description}</div>` : ''}
        <div class="cm">🕐 <strong>${activity.startTime}</strong> – ${activity.endTime}${duration}</div>
        <div class="cm">📅 ${activity.date}</div>
        <span class="badge">${activity.category}</span>
      </div>
      <p class="t">Stay focused and make the most of your time. You've got this! 💪</p>
    </div>
    <div class="f">© ${new Date().getFullYear()} DoBetter. All rights reserved.</div>
  </div></body></html>`;
}

/* ─── Exported functions ─────────────────────────────────────────────────── */

async function sendLoginEmail(email, fullName) {
  const time = new Date().toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long',
    day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  });
  await transporter.sendMail({
    from: `"DoBetter" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: '🔐 New Login to Your DoBetter Account',
    html: loginEmailHtml(fullName, email, time),
  });
  console.log(`✅ Login email sent to ${email}`);
}

async function sendReminderEmail(email, fullName, activity) {
  await transporter.sendMail({
    from: `"DoBetter" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `⏰ Reminder: "${activity.title}" starts in 5 minutes`,
    html: reminderEmailHtml(fullName, activity),
  });
  console.log(`✅ Reminder sent to ${email} for: ${activity.title}`);
}

module.exports = { sendLoginEmail, sendReminderEmail };
