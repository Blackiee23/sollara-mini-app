const express = require('express');
const fetch = require('node-fetch'); // Make sure this is installed
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
    const { message } = req.body;
    if (message && message.text === '/start') {
        const chatId = message.chat.id;
        const botToken = "7722901231:AAGdH9ojOaurKGs89OR-TpZXsmcPPMzCC4M"; // Replace this with your bot token

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

module.exports = app;
