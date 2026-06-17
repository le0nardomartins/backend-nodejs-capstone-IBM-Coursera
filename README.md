# SecondChance - IBM Coursera Capstone Project

[![IBM Coursera](https://img.shields.io/badge/IBM-Coursera-1261A6?style=for-the-badge)](https://www.coursera.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-386641?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-Restricted-red?style=for-the-badge)](LICENSE.txt)

SecondChance is a full-stack marketplace web application developed as the capstone project for the IBM Full Stack Application Development course on Coursera. The platform enables users to list, search, and find second-hand items, giving pre-owned goods a new life.

## Author

**Leonardo Martins**

[Website](https://www.leonardomartins.dev/)
[LinkedIn](https://www.linkedin.com/in/leonardomartinscunha/)
[GitHub](https://github.com/le0nardomartins)

## Project Overview

SecondChance is a MERN-stack application where users can browse second-hand items, register and log in, post new items with images, and search by name or category. The platform also includes a sentiment analysis microservice to assess user comments.

The application demonstrates:

* Full-stack development with Node.js, Express, React, and MongoDB
* RESTful API design and implementation
* JWT-based authentication (register, login, update)
* File upload handling with Multer
* Sentiment analysis using the `natural` NLP package
* CI/CD pipeline with GitHub Actions
* Docker-based local development environment

## Project Structure

```text
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── user-story.md        # User story issue template
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD pipeline
├── secondChance-backend/        # Express.js REST API
│   ├── data/
│   │   ├── items.json           # 16 seed documents for MongoDB
│   │   └── seedDB.js            # Database seeding script
│   ├── models/
│   │   └── db.js                # MongoDB connection
│   ├── routes/
│   │   ├── authRoutes.js        # Login, register, update user
│   │   ├── searchRoutes.js      # Search with category/name/condition filter
│   │   └── secondChanceItemsRoutes.js  # Items CRUD + file upload
│   ├── uploads/                 # Uploaded item images
│   ├── app.js                   # Express app entry point
│   ├── Dockerfile
│   └── package.json
├── secondChance-frontend/       # React single-page application
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   └── pages/
│   │       ├── MainPage.js      # Browse all items
│   │       ├── ItemDetails.js   # Item details + sentiment
│   │       ├── Register.js
│   │       ├── Login.js
│   │       ├── AddItem.js
│   │       └── SearchResults.js
│   ├── Dockerfile
│   └── package.json
├── sentiment/                   # Sentiment analysis microservice
│   ├── index.js                 # Express server using natural package
│   └── package.json
├── docker-compose.yml           # Full stack local environment
└── README.md
```

## Getting Started

Follow these steps to run the project locally.

## Prerequisites

* [Node.js](https://nodejs.org/) v20 or higher
* [Docker](https://www.docker.com/) (recommended for MongoDB)
* npm (included with Node.js)

## Installation

Clone the repository:

```bash
git clone https://github.com/le0nardomartins/backend-nodejs-capstone-IBM-Coursera.git
```

Navigate to the project folder:

```bash
cd backend-nodejs-capstone-IBM-Coursera
```

## Running with Docker (Recommended)

Start all services (MongoDB, backend, sentiment, frontend) with a single command:

```bash
docker-compose up --build
```

The services will be available at:

```text
Frontend:  http://localhost:3000
Backend:   http://localhost:3060
Sentiment: http://localhost:3070
```

## Running Manually

**1. Start MongoDB** (via Docker or a local installation):

```bash
docker run -d -p 27017:27017 mongo:6.0
```

**2. Install and start the backend:**

```bash
cd secondChance-backend
npm install
node data/seedDB.js   # Import 16 seed documents
npm start
```

**3. Install and start the sentiment service:**

```bash
cd sentiment
npm install
npm start
```

**4. Install and start the frontend:**

```bash
cd secondChance-frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/secondchance/items` | List all items |
| GET | `/api/secondchance/items/:id` | Get item by ID |
| POST | `/api/secondchance/items` | Create item (with image upload) |
| PUT | `/api/secondchance/items/:id` | Update item |
| DELETE | `/api/secondchance/items/:id` | Delete item |
| GET | `/api/secondchance/search` | Search by name, category, condition |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| PUT | `/api/auth/update` | Update user information |
| POST | `/sentiment` | Analyze text sentiment |

## Features

* Browse and search second-hand items by name, category, and condition
* User registration and JWT authentication
* Post new items with image uploads
* Item details page with sentiment analysis for comments
* Responsive UI built with React and Bootstrap
* CI/CD pipeline with automated tests via GitHub Actions
* Docker Compose for streamlined local development

## Technologies Used

* **Frontend:** React 18, React Router, Bootstrap 5, Axios
* **Backend:** Node.js, Express.js, Multer, JWT, bcryptjs
* **Database:** MongoDB 6.0 (via MongoDB Node.js Driver)
* **Microservice:** natural (NLP sentiment analysis)
* **DevOps:** Docker, Docker Compose, GitHub Actions
* **Tools:** Git, GitHub, npm

## Coursera Submission

This project was developed as the capstone for the IBM Full Stack Application Development course on Coursera.

It is intended for academic submission and learning purposes only.

## License and Terms of Use

This project is under a restricted license for academic purposes. Please refer to the [LICENSE.txt](LICENSE.txt) file for more details regarding prohibited use, commercial restrictions, redistribution limitations, and academic integrity requirements.

This code may not be copied, reused, modified, submitted, or redistributed as part of Coursera assignments, final projects, academic coursework, or commercial projects.
