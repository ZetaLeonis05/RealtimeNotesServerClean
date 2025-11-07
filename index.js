const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const fcm = admin.messaging();

db.collection("notes").onSnapshot(async (snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    const data = change.doc.data();

    let title = "";
    let body = "";

    if (change.type === "added") {
      title = "Yeni Not Eklendi 📝";
      body = data.text || "Yeni bir not oluşturuldu.";
    } else if (change.type === "modified") {
      title = "Not Güncellendi ✏️";
      body = data.text || "Bir not düzenlendi.";
    } else if (change.type === "removed") {
      title = "Not Silindi 🗑️";
      body = data.text || "Bir not silindi.";
    }

    if (title) {
      await fcm.send({
        topic: "notes",
        notification: {
          title,
          body
        }
      });
      console.log("Bildirim gönderildi:", title);
    }
  });
});
