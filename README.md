# Smart Recipe Generator

## 🔗 Live Preview
👉 [Smart Recipe Generator](https://smart-recipegenerator.netlify.app)

---
## Project Description
A full-stack web application that helps users find recipes based on available ingredients, dietary preferences, and other filters. It features a React-based frontend and a Node.js backend.

## Features
*   **Recipe Search:** Find recipes by ingredients.
*   **Recipe Filtering:** Filter recipes by dietary restrictions, difficulty, cooking time, calories, and cuisine.
*   **Recipe Details:** View detailed information for each recipe, including ingredients, instructions, nutrition, and more.
*   **Image Display:** Displays relevant images for each recipe.
*   **Responsive Design:** User-friendly interface across various devices.

## Technologies Used
### Frontend
*   React.js
*   Axios (for API calls)
*   Styled Components (for styling)
*   React Router DOM (for navigation)
*   React Icons (for icons)
*   React Select (for dropdowns)
*   React Rating Stars Component (for rating display)

### Backend
*   Node.js
*   Express.js (for API)
*   CORS (for cross-origin requests)
*   Body-parser (for parsing request bodies)
*   Fuse.js (for fuzzy searching ingredients)

## Installation

To set up the project locally, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/Anika9129/Smart-Recipe-Generator.git
cd Smart-Recipe-Generator
```

### 2. Install Backend Dependencies
Navigate to the `backend` directory and install the required packages:
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
Navigate to the `frontend` directory and install the required packages:
```bash
cd ../frontend
npm install
```

## Running the Project

You will need two separate terminal windows to run the backend and frontend concurrently.

### 1. Run the Backend Server
In your first terminal, from the `backend` directory:
```bash
cd C:\Users\singh\OneDrive\Desktop\daffodil\smart-recipe-generator\backend
npm start
```
The backend server will start on `http://localhost:5000`.

### 2. Run the Frontend Application
In your second terminal, from the `frontend` directory:
```bash
cd C:\Users\singh\OneDrive\Desktop\daffodil\smart-recipe-generator\frontend
npm start
```
The frontend application will open in your browser, usually at `http://localhost:3000`.

## Project Structure
```
.
├── backend/
│   ├── package.json
│   ├── server.js
│   └── ... (node_modules, etc.)
├── controllers/
│   └── recipeController.js
├── database/
│   └── recipes.json
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── images/
│   │   │   └── recipes/ (all recipe images)
│   │   └── recipes.json (static recipe data for Netlify deployment)
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   ├── components/
│   │   │   └── ... (React components)
│   │   └── services/
│   │       └── recipeService.js
│   └── ... (node_modules, etc.)
├── package.json
├── .gitignore
└── README.md
```
