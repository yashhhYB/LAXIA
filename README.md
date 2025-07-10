# LAXIA – Legal AI Assistant 👩‍⚖️⚖️

LAXIA is a voice-enabled, location-aware, AI-powered legal assistant built to democratize access to legal knowledge. Whether you're a law student, traveler, or an everyday citizen, LAXIA helps you understand laws, your rights, and legal processes through an intuitive mobile app.

---

## 🚀 What It Does

- Understand complex legal queries with natural language using OpenAI
- Speak directly to LAXIA using voice AI powered by ElevenLabs
- Get local laws based on real-time geolocation
- Browse constitution & IPC sections for multiple countries
- Practice legal quizzes, flashcards, and test prep for law exams
- Integrates Reddit discussions for real-world legal opinions
- Beautifully built with Expo, Bolt.new, and cutting-edge AI

---

## 🧠 Inspiration

Legal knowledge should not be locked away in jargon. LAXIA was built to bring the power of law to the fingertips of everyone. From travelers confused about local laws to students preparing for competitive exams, this app bridges the legal knowledge gap using AI, voice, and modern design.

---

## 🧩 Tech Stack

| Layer             | Tools & Services                                  |
|------------------|---------------------------------------------------|
| Frontend         | Expo + React Native + Bolt.new UI                 |
| AI Chatbot       | OpenAI API                                        |
| Voice Assistant  | ElevenLabs API                                    |
| Backend          | Supabase (Auth, Realtime DB)                      |
| Location API     | Geolocation APIs (Browser/Native)                 |
| Data Integrations| Reddit Developer Platform                         |
| Design Utilities | Pica, 21st.dev, V0.dev                            |
| Deployment       | Netlify (Web), EAS Build (Android APK)            |

---

## 📱 Features

- 🔹 AI Legal Assistant – Ask and get legal answers instantly
- 🔹 Voice Query Support – Talk to LAXIA using natural voice
- 🔹 Learn by Flashcards – Digest IPC sections and constitutional info
- 🔹 Law Quiz – Test yourself with legal MCQs
- 🔹 Student Mode – Summaries and practice content for law students
- 🔹 Country-wise Laws – Browse constitutions and laws by country
- 🔹 Travel Mode – Auto-load laws based on GPS
- 🔹 Reddit Feeds – Read and share real-world legal discussions

---

## 🖼 Screenshots

> Add screenshots here from your `/assets/screenshots/` folder  
> Example:
> - Home Page  
> - ChatBot Screen  
> - Learn Section  
> - Law Quiz Interface

---

## 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/laxia-legal-ai.git
cd laxia-legal-ai

# Install dependencies
npm install

# Start app (Expo)
npx expo start
⚙️ Building APK Locally
bash
Copy
Edit
# Prebuild native android code
npx expo prebuild

# Build APK for Android locally
npx expo run:android --variant release
APK Output:

swift
Copy
Edit
android/app/build/outputs/apk/release/app-release.apk
🏗️ Build Using EAS
bash
Copy
Edit
# Build APK using EAS (cloud)
npx eas build --platform android
Note: Setup Expo and EAS CLI before using. Requires Expo account.

🧱 How I Built It
Bolt.new used to visually create frontend layout

Components were exported to React Native with theme preserved

Pica and 21st.dev helped generate intelligent UI blocks and logic

APIs for OpenAI, ElevenLabs, Supabase, and Reddit integrated manually

Netlify was used for frontend deployment

Android APK was built via EAS CLI and tested on physical device

🧗 Challenges Faced
API rate limits with voice and GPT models

Country-wise legal data standardization

Long build times on free EAS plans

Compatibility fixes between Expo SDK and native Gradle

🏅 Accomplishments
Created a full-stack AI-driven legal assistant solo

Integrated real-time law discovery based on user’s location

Managed legal data, voice queries, AI conversations, and quizzes in a single UI

Combined tech (AI + voice + location) to solve a real problem

📚 What I Learned
Efficient use of Bolt and Pica for rapid app prototyping

Handling AI APIs with voice and chat input

Using Supabase for auth and realtime syncing

Advanced deployment with Expo, EAS CLI, and Netlify

Managing build failures and Gradle configs in production

📍 What’s Next for LAXIA
Regional language support for India and global reach

Offline access to legal content and quizzes

In-app FIR and document generator tools

Lawyer discovery and booking system

More country-specific legal frameworks and real-world datasets

🤝 Contributing
Contributions, suggestions, and PRs are welcome!

bash
Copy
Edit
# Fork & clone this repo
git checkout -b feature/amazing-feature
git commit -m "Add something awesome"
git push origin feature/amazing-feature
Then submit a pull request 🚀

👤 Author
Yash Bodade
📧 yashbodadeyb333@gmail.com
🔗 LinkedIn

