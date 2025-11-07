const admin = require("firebase-admin");
const express = require("express");

const app = express();
app.use(express.json());

// JSON anahtarı ortam değişkeninden çekiyoruz:
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("Realtime Notes Server Çalışıyor ✅");
});

// Basit bir test endpoint (bildirim için)
app.post("/sendNotification", async (req, res) => {
  try {
    const { token, title, body } = req.body;

    const message = {
      notification: { title, body },
      token
    };

    await admin.messaging().send(message);
    res.status(200).send("Bildirim gönderildi ✅");
  } catch (error) {
    console.error("Bildirim hatası:", error);
    res.status(500).send("Hata: " + error.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
