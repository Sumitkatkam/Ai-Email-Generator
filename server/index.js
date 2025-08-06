const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// === Logging to check env vars ===
console.log("GROQ_API_KEY:", process.env.GROQ_API_KEY ? "✅ Set" : "❌ Missing");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ Not found");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");

// === OPENAI SETUP ===
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
});

// === EMAIL TRANSPORTER SETUP ===
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // <<== ADD THIS LINE
  },
});

// === ROUTES ===

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ AI Email Sender Backend is running.');
});

// ✅ Test email sending
app.get('/test-send', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself
      subject: "Test Email from Node.js",
      html: "<p>This is a test email from your AI Email Sender app.</p>",
    });
    res.send('✅ Test email sent to your own Gmail inbox');
  } catch (err) {
    console.error('❌ Error sending test email:', err);
    res.status(500).send('❌ Failed to send test email');
  }
});

// ✅ Generate email from prompt
app.post('/generate-email', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'llama3-8b-8192', //llama3-70b-8192
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const emailContent = completion.choices[0].message.content;
    res.json({ emailContent });
  } catch (err) {
    console.error('❌ Error generating email:', err.message);
    res.status(500).json({ error: 'Failed to generate email' });
  }
  console.log("Prompt:", prompt);
  console.log("Generated Response:", emailContent);
});

// ✅ Send email
app.post('/send-email', async (req, res) => {
  const { recipients, subject, body } = req.body;

  if (!recipients || !subject || !body) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(','),
    subject,
    html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: '✅ Email sent successfully' });
  } catch (err) {
    console.error('❌ Error sending email:', err.message);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
