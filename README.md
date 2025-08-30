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
## 🛠️ Development Journey & Challenges

When I started working on this Smart Recipe Generator, the first hurdle was getting the recipe images to display correctly.  
I quickly realized it wasn't just one issue; there were inconsistencies in how image paths were handled in the frontend code and discrepancies between the backend's recipe data and the actual image files.

My approach involved a bit of detective work. I dug into the backend's server logic and the frontend's display components, systematically fixing image paths and ensuring filenames matched exactly.  
A significant discovery was finding two separate `recipes.json` files, which was causing a lot of confusion.  
I decided the best long-term solution was to consolidate them into a single, authoritative database and update the frontend to fetch all its data from the backend API.

Preparing for Netlify deployment brought its own set of challenges, especially with the frontend's build process.  
I adapted the project for static hosting by moving the recipe data directly into the frontend's public assets.  
When the Netlify builds initially failed due to strict ESLint rules, I implemented a workaround to ensure the project could compile successfully in a CI environment.

Ultimately, my goal was to create a robust and maintainable application.  
I focused on:

- Cleaning up the data flow  
- Ensuring a smooth user experience with proper image display  
- Setting up a straightforward deployment process  
- Documenting everything thoroughly in the README so anyone can easily understand, run, and deploy the project  

---

## 🚀 Deployment

The project is deployed on **[Netlify](https://smart-recipegenerator.netlify.app/)** for frontend hosting.  

---

## 👩‍💻 Author

**Anika Singh**  
📧 2k22.it.2211014@gmail.com  

🔗 [GitHub](https://github.com/Anika9129)

