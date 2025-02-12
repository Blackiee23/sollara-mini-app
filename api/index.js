const express = require('express');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Define your webhook route
app.post('/api/webhook', (req, res) => {
    const { message } = req.body;

    if (message && message.text === "/start") {
        const chatId = message.chat.id;
        const botToken = "YOUR_BOT_TOKEN"; // Replace with your real bot token

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: "Welcome to Sollara MiniApp! Click the button below to open the app.",
                reply_markup: {
                    inline_keyboard: [[{ text: "Open App", web_app: { url: "https://sollara-mini-app-zb82.vercel.app/" } }]]
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Message sent:", data);
            res.sendStatus(200); // Respond with OK
        })
        .catch(err => {
            console.error("Error sending message:", err);
            res.sendStatus(500); // Respond with server error
        });
    } else {
        res.sendStatus(200); // Handle other messages
    }
});

// Export the app
module.exports = app;
