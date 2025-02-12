const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const { message } = req.body;
    if (message && message.text === "/start") {
        const chatId = message.chat.id;
        const botToken = "YOUR_BOT_TOKEN"; // Replace with your actual bot token
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: "Welcome to Sollara MiniApp! Click the button below to open the app.",
                reply_markup: {
                    inline_keyboard: [[{ text: "Open App", web_app: { url: "https://sollara-mini-app.vercel.app/" } }]]
                }
            })
        });
        res.sendStatus(200);
    } else {
        res.sendStatus(200);
    }
});

module.exports = app;  // Make sure to export the app for Vercel deployment
