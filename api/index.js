// /api/index.js

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;

    if (message && message.text === "/start") {
      const chatId = message.chat.id;
      const botToken = "YOUR_BOT_TOKEN";  // Replace with your actual bot token

      // Send the message using Telegram API
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
        res.status(200).send('OK');
      })
      .catch(err => {
        console.error("Error sending message:", err);
        res.status(500).send('Error');
      });
    } else {
      res.status(200).send('No valid message');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};
