🌍 Globe Travel

Globe Travel is a prototype **travel booking platform** with an integrated **AI-powered chatbot**. It allows users to explore attractions, browse hotel and house listings, and view detailed property pages with galleries, amenities, booking forms, and maps.

## ✨ Features

* 🏨 **Hotel & House Listings** – Browse accommodations with pricing, amenities, and ratings.
* 🏠 **Property Detail Pages** – View galleries, descriptions, and booking options.
* 🔑 **Authentication** – Front-end login/register system using local storage.
* 🤖 **AI Chatbot** – Provides interactive assistance for trip planning.
* 📧 **Email Support** – Node.js backend with **Express**, **CORS**, and **Nodemailer** for handling requests.
* 📱 **Responsive Design** – Optimized for desktop and mobile devices.

## 🛠️ Tech Stack

**Frontend**

* HTML5, CSS3, JavaScript
* React Components (for hotel recommendations)
* Bootstrap & Font Awesome

**Backend**

* Node.js with Express
* CORS for cross-origin requests
* Nodemailer for email notifications

## 📂 Project Structure

```
├── index.html            # Homepage  
├── listing.html          # Listings page  
├── house.html            # Property details page  
├── hotel.html            # React hotel component  
├── style.css             # Main styles  
├── hotel-detail.css      # Hotel details styles  
├── hotel-details.css     # Duplicate/variant styling  
├── auth.js               # Frontend authentication  
├── package.json          # Node.js dependencies  
└── package-lock.json     # Dependency lockfile  
```

## 🚀 Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/rida05432/globe-travel.git
cd globe-travel
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the project**
   You can serve the frontend with a local server (e.g., Live Server in VS Code).
   To run backend features:

```bash
node server.js
```

4. **Open in Browser**
   Visit `http://localhost:3000` or your Live Server port.
