# 🎵 Audio Electronics Store

🚀 A modern, multi-page Vue application for an audio electronics store.  
This project provides a fully responsive storefront featuring dynamic product listings, a real-time shopping cart powered by Pinia, and a sleek user interface built with Vuetify.

---

## 🌟 Features

- ✅ **Multi-Page Layout:** Separate pages for Home, About, Products, and Contact.
- ✅ **Responsive Design:** Optimized for desktops, tablets, and smartphones using custom SCSS and media queries.
- ✅ **Dynamic Shopping Cart:** Real-time cart updates using Pinia for state management.
- ✅ **Modern UI Components:** Built with Vuetify and Material Design Icons.
- ✅ **Interactive Testimonials & Product Sections:** Engaging user reviews and product cards with smooth transitions.
- ✅ **Clean, Modular Code:** Organized structure with reusable components and SCSS for maintainable styling.

---

## 📋 Requirements

Before running the project, ensure you have the following installed:

- **Node.js** (v18 or newer) → [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository)

---

## 🚀 How to Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Audio-Electronics-Store.git

# 2. Navigate into the project folder
cd Audio-Electronics-Store

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```
#### By default, the app runs on http://localhost:5173.

---

## 🐳 Run with Docker

The only requirement is [Docker](https://docs.docker.com/get-docker/) (Docker Desktop on Windows/macOS) with Compose v2. Node.js is not needed.

### Quick start (one script)

The setup script checks that Docker is installed and running, builds the image, starts the container and waits until the app responds.

```bash
# Linux / macOS / Git Bash
./scripts/docker-setup.sh
```

```powershell
# Windows PowerShell
.\scripts\docker-setup.ps1
```

The app is then available at http://localhost:8080.

| Bash                  | PowerShell     | What it does                                          |
| --------------------- | -------------- | ----------------------------------------------------- |
| _(no options)_        | _(no options)_ | Production build served by nginx on port 8080         |
| `--dev`               | `-Dev`         | Vite dev server with hot reload on port 5173          |
| `--port 3000`         | `-Port 3000`   | Use a different host port                             |
| `--logs`              | `-Logs`        | Follow container logs                                 |
| `--stop`              | `-Stop`        | Stop and remove the containers                        |

> If PowerShell blocks the script, run it with
> `powershell -ExecutionPolicy Bypass -File .\scripts\docker-setup.ps1`.

### Manual commands

```bash
# Production (nginx) on http://localhost:8080
docker compose up -d --build app

# Development with hot reload on http://localhost:5173
docker compose --profile dev up --build dev

# Stop everything
docker compose --profile dev down
```

Ports can be changed with the `APP_PORT` and `DEV_PORT` environment variables.

---

## 📌 How It Works

### 1️⃣ Routing & Navigation
The application is structured into multiple pages with Vue Router.  
Navigation is handled via a responsive Navbar that adapts to mobile devices by switching to a full-screen modal menu.

### 2️⃣ Dynamic Shopping Cart
The shopping cart uses Pinia to maintain a global state.  
Cart updates (addition, quantity changes, removals) are reflected immediately across the application.

### 3️⃣ Responsive Layout & Styling
The UI is built using Vuetify components, SCSS, and custom media queries to ensure a smooth experience on desktops, tablets, and smartphones.  
Key sections (Home, About, Products, Contact) are styled with modern gradients, responsive typography, and grid/flex layouts.

### 4️⃣ Interactive Testimonials & Product Sections
Testimonials and product cards feature smooth transitions and hover effects.  
Components are designed to be modular and easily maintainable.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📌 Additional Notes

- Ensure that all image assets are placed in the correct directories under `src/assets/img/`.
- The project uses Vuetify for UI components and Material Design Icons (imported via `@mdi/font/css/materialdesignicons.css`).
- Pinia is used for global state management of the shopping cart.
- For a multi-page setup with Vue CLI, refer to `vue.config.js`. For Vite, see `vite.config.js`.
