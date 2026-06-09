# Mini Cloud Resource Sharing Platform — Frontend

A modern cloud dashboard built with **React + Vite + Tailwind CSS**.

---

## 📁 Project Structure

```
mini-cloud-platform/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ProgressBar.jsx
│   │   ├── Spinner.jsx
│   │   ├── StatCard.jsx
│   │   └── Toast.jsx
│   ├── layouts/
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Machines.jsx
│   │   ├── Deploy.jsx
│   │   └── Allocations.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚙️ Prerequisites

- Node.js v18+ (recommended v20+)
- npm v9+
- Your backend running at `http://localhost:5000`

---

## 🚀 Setup & Run

### Step 1 — Extract the zip

Unzip `mini-cloud-platform.zip` to any folder.

### Step 2 — Install dependencies

```bash
cd mini-cloud-platform
npm install
```

### Step 3 — Start your backend

Make sure your backend is running:

```bash
cd ../backend
npm install       # if not already done
node server.js
```

Backend should be live at: `http://localhost:5000`

### Step 4 — Start the frontend

```bash
npm run dev
```

Open your browser at: **http://localhost:3000**

---

## 🔌 API Proxy

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000/api`.

This is configured in `vite.config.js`:

```js
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  }
}
```

So the frontend calls `/api/dashboard`, `/api/machines`, etc., and Vite forwards them to your backend automatically — **no CORS issues**.

---

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Serve it with any static file server or Nginx.

---

## 📄 Pages

| Route          | Description                              |
|----------------|------------------------------------------|
| `/`            | Dashboard — stats overview, auto-refresh |
| `/machines`    | Connected machines with CPU/RAM bars     |
| `/deploy`      | Deploy a new workload container          |
| `/allocations` | View all workload allocations            |

---

## 🎨 Tech Stack

- **React 18** — UI framework
- **React Router DOM v6** — Client-side routing
- **Axios** — HTTP client
- **Tailwind CSS v3** — Utility-first styling
- **Vite 5** — Lightning-fast build tool

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| `npm install` fails | Make sure Node.js v18+ is installed |
| White screen / API errors | Ensure backend is running on port 5000 |
| Port 3000 in use | Change port in `vite.config.js` → `port: 3001` |
| Tailwind styles not loading | Run `npm install` again, then `npm run dev` |
