***

# Customer and Address Management - Full-Stack Application

This is a full-stack web application for managing customer information and their associated addresses. It features a complete CRUD (Create, Read, Update, Delete) interface for both customers and their multiple addresses.

The project is built with a modern JavaScript stack, featuring a Node.js/Express backend API and a responsive React frontend.

## Features

-   **Customer Management**:
    -   Create new customers with a first name, last name, and a unique phone number.
    -   View a list of all existing customers.
    -   Update a customer's personal details.
    -   Delete a customer (which also removes all their associated addresses).
-   **Address Management**:
    -   Add one or more addresses for each customer.
    -   View all addresses associated with a specific customer.
    -   Update and delete individual addresses.
-   **Full-Stack Architecture**:
    -   A RESTful API backend to handle all business logic and database interactions.
    -   A separate client-side single-page application (SPA) for a smooth user experience.
-   **Key Functionality**:
    -   **Server-Side Validation**: Ensures data integrity before it reaches the database.
    -   **Dynamic Routing**: Uses React Router for seamless navigation between pages.
    -   **Search, Sort, and Pagination**: (As described in the project requirements) The API is built to support these features for the customer list.

## Tech Stack

-   **Backend**:
    -   **[Node.js](https://nodejs.org/)**: JavaScript runtime for the server.
    -   **[Express.js](https://expressjs.com/)**: Web framework for building the REST API.
    -   **[SQLite](https://www.sqlite.org/)**: Lightweight, file-based SQL database for data persistence.
    -   **[CORS](https://expressjs.com/en/resources/middleware/cors.html)**: Middleware for enabling cross-origin requests.

-   **Frontend**:
    -   **[React JS](https://reactjs.org/)**: A JavaScript library for building user interfaces.
    -   **[React Router](https://reactrouter.com/)**: For client-side routing and navigation.
    -   **[Axios](https://axios-http.com/)**: For making HTTP requests from the frontend to the backend API.

## Project Structure

The application is organized into two main parts within the root directory:

```
customer-management-app/
├── client/         # Contains the React JS frontend application
└── server/         # Contains the Node.js/Express backend API
```

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/en/download/) (version 14.x or higher)
-   [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/customer-management-app.git
    cd customer-management-app
    ```

2.  **Set up the Backend Server:**
    -   Navigate to the `server` directory:
        ```sh
        cd server
        ```
    -   Install the required npm packages:
        ```sh
        npm install
        ```
    -   Start the backend server (it will run on `http://localhost:5000`):
        ```sh
        node index.js
        ```
    -   The server will automatically create the `database.db` file and set up the necessary tables on its first run.

3.  **Set up the Frontend Client:**
    -   Open a **new terminal window** and navigate to the `client` directory:
        ```sh
        cd client
        ```
    -   Install the required npm packages:
        ```sh
        npm install
        ```
    -   Start the React development server (it will open in your browser at `http://localhost:3000`):
        ```sh
        npm start
        ```

You should now have the application running locally with the frontend communicating with the backend.

***

