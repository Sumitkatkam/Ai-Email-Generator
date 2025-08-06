import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [recipient, setRecipient] = useState("");
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("AI Generated Email");
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const handleGenerateEmail = async () => {
    if (!prompt.trim()) {
      toast.warn("Please enter a prompt.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/generate-email", { prompt });

      if (res.data?.emailContent) {
        setEmailContent(res.data.emailContent);
        toast.success("Email generated!");
      } else {
        toast.error("Failed to generate email.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error generating email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipient || !emailContent) {
      toast.warn("Recipient and email content are required.");
      return;
    }

    try {
      setSending(true);
      const res = await axios.post("http://localhost:5000/send-email", {
        recipients: [recipient],
        subject,
        body: emailContent,
      });

      if (res.data?.message) {
        toast.success("Email sent successfully!");
        setRecipient("");
        setPrompt("");
        setEmailContent("");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        AI Email Generator & Sender
      </h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Recipients</label>
        <input
          type="text"
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          placeholder="e.g. johndoe@example.com"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Prompt</label>
        <textarea
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          rows="3"
          placeholder="e.g. Write a cold email applying for a React developer internship at Google"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleGenerateEmail}
          disabled={loading}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Generating..." : "Generate Email"}
        </button>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Subject</label>
        <input
          type="text"
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Generated Email Content</label>
        <textarea
          className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          rows="8"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </div>

      <button
        onClick={handleSendEmail}
        disabled={sending}
        className={`bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition ${
          sending ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {sending ? "Sending..." : "Send Email"}
      </button>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default App;
