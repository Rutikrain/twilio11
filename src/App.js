import React, { useState } from "react";
import axios from "axios";

function App() {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);

  const sendMessage = async () => {
    try {
      const res = await axios.post("http://localhost:3000/send-message", {
        to: number,
        message: message,
      });

      const newLog = {
        number,
        message,
        status: res.data.success ? "Sent" : "Failed",
      };

      setLogs([newLog, ...logs]);
    } catch (err) {
      setLogs([
        { number, message, status: "Error" },
        ...logs,
      ]);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Twilio WhatsApp Dashboard</h1>
        <div className="connection-status">
          <span className="status-dot"></span>
          Connected
        </div>
      </header>

      <main className="dashboard-content">
        {/* Stats */}
        <section className="stats-container">
          <div className="card stat-card total">
            <span className="card-icon">📊</span>
            <div>
              <p className="card-label">Total Messages</p>
              <h2 className="card-value">{logs.length}</h2>
            </div>
          </div>
          <div className="card stat-card sent">
            <span className="card-icon">✅</span>
            <div>
              <p className="card-label">Sent Successful</p>
              <h2 className="card-value">
                {logs.filter(l => l.status === "Sent").length}
              </h2>
            </div>
          </div>
          <div className="card stat-card failed">
            <span className="card-icon">❌</span>
            <div>
              <p className="card-label">Failed / Error</p>
              <h2 className="card-value">
                {logs.filter(l => l.status !== "Sent").length}
              </h2>
            </div>
          </div>
        </section>

        <div className="action-grid">
          {/* Send Message */}
          <section className="card form-card">
            <h2 className="card-title">Send New Message</h2>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon">📱</span>
                <input
                  placeholder="+91XXXXXXXXXX"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Message Content</label>
              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={!number || !message}
            >
              <span>Send WhatsApp Message</span>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </section>

          {/* Logs */}
          <section className="card history-card">
            <h2 className="card-title">Recent Activity</h2>
            <div className="table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Recipient</th>
                    <th>Message Snippet</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="empty-state">No messages sent yet.</td>
                    </tr>
                  ) : (
                    logs.map((log, i) => (
                      <tr key={i}>
                        <td className="font-medium">{log.number}</td>
                        <td className="message-snippet">{log.message}</td>
                        <td>
                          <span className={`status-badge ${log.status.toLowerCase()}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;