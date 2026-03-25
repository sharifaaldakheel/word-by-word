# 🧠 Word by Word — Guessing Game

A fast-paced, word-by-word guessing game built with **React 19** and **Firebase**.  
The earlier you guess correctly, the higher your score. Compete with others on the live leaderboard.

🔗 **Live Demo:** [https://word-by-word-b3bcb.web.app](https://word-by-word-b3bcb.web.app)

---

## 🎮 How to Play

1. Enter your name and get assigned a random avatar
2. A general knowledge clue reveals itself **one word at a time**
3. Hit the correct answer at any point, try to answer early
4. The earlier you answer correctly, the more points you earn
5. Wrong answer or timeout = **0 points**
6. Your score is saved to the live leaderboard automatically

---

## ✨ Features

- 🔤 Word-by-word question reveal
- ⏱️ Score based on how early you guess
- 🏆 Live leaderboard (real-time Firestore)
- 🎭 Random avatar assigned per session
- 🌙 Dark / Light mode toggle
- 🌍 Arabic and English support (full RTL layout)
- 📱 Fully responsive — works on mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Database | Firebase Firestore |
| Auth | Firebase Anonymous Auth |
| Storage | Firebase Storage (avatars) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

---

## 🚀 Local Setup

### Prerequisites
- Node.js v20.19+ or v22+
- npm v10+
- A Firebase project ([console.firebase.google.com](https://console.firebase.google.com))

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/word-by-word.git
cd word-by-word
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Get these from **Firebase Console → Project Settings → Your apps**

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔥 Firestore Data Structure

### `questions` collection

```json
{
  "wordCount": 9,
  "difficulty": "medium",
  
  "en": {
    "words": ["A", "young", "boy", "discovers", "he", "can", "see", "dead", "people"],
    "choices": ["The Sixth Sense", "Signs", "Unbreakable", "The Others"],
    "answer": "The Sixth Sense",
    "difficultyLabel": "Medium"
  },
  "ar": {
    "words": ["فتى", "صغير", "يكتشف", "أنه", "يرى", "الموتى"],
    "choices": ["الحاسة السادسة", "علامات", "لا يُكسر", "الآخرون"],
    "answer": "الحاسة السادسة",
    "difficultyLabel": "متوسط"
  }
}
```

### `leaderboard` collection

Saved automatically after each game:

```json
{
  "name": "Ahmed",
  "score": 42,
  "avatarUrl": "https://firebasestorage...",
  "rank": 3,
  "uid": "anonymous_uid",
  "timestamp": "2026-01-01T00:00:00Z"
}
```

---

## 🔐 Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{playerId} {
      allow read, write: if request.auth != null;
    }
    match /questions/{id} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /leaderboard/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.score is int
                    && request.resource.data.name is string
                    && request.resource.data.name.size() <= 20;
      allow update, delete: if false;
    }
  }
}
```

---

## 📁 Project Structure

```
src/
  services/
    questions.js          ← fetchQuestions() from Firestore
    leaderboard.js        ← saveScore(), subscribeLeaderboard()
    player.js             ← createPlayer(), updatePlayerScore()
  components/
    GameHeader.jsx        ← dark mode + language toggle
    LobbyScreen.jsx       ← name input, avatar, live leaderboard
    InstructionScreen.jsx ← game rules
    QuestionScreen.jsx    ← word reveal, scoring, timer
    ResultScreen.jsx      ← final score, save to Firestore
  lib/
    firebase.js           ← Firebase init + anonymous auth
  App.jsx                 ← screen router, global player state
```

---

## 📦 Deployment

### Manual deploy

```bash
npm run build
firebase deploy
```

### Auto-deploy on push to `main`

Every push to `main` triggers a GitHub Actions workflow that builds and deploys to Firebase Hosting automatically.

Add these as **GitHub repository secrets** (Settings → Secrets → Actions):

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

---

## 📝 License

MIT
