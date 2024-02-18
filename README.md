# MERN Backend Setup

This repository contains the backend codebase for a MERN (MongoDB, Express.js, React.js, Node.js) project.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- MongoDB Atlas account (or a local MongoDB server) for database storage

## Getting Started

To set up and run the MERN backend, follow these steps:

1. **Clone the Repository:**

   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies:**

   ```
   pnpm install
   ```

3. **Configure Environment Variables:**

   - Create a `.env` file in the root directory.
   - Define the following environment variables in the `.env` file:
     ```
     PORT=<backend-port>
     MONGODB_URI=<mongodb-uri>
     ```

4. **Start the Server:**

   ```
   pnpm start
   ```

5. **Access the API:**
   - Once the server is running, you can access the API endpoints at `http://localhost:<backend-port>`.

To provide details about the provided API endpoints in the README, you can update the README.md file as follows:

---

## API

This section outlines the available API endpoints for the backend.

## Initialization Endpoint

### Initialize Database

- **URL:** `/roxiler/init`
- **Method:** GET
- **Description:** Initializes the database with seed data fetched from a third-party API.
- **Parameters:** None
- **Response:**
  - Status Code: 200 OK
  - Body: `{ message: 'Database initialized successfully' }`
  - Status Code: 500 Internal Server Error
  - Body: `{ error: 'Failed to initialize database' }`

## Product Endpoints

### List Products

- **URL:** `/roxiler/products`
- **Method:** GET
- **Description:** Retrieves a list of products based on search parameters and pagination.
- **Parameters:**
  - `search`: Search keyword (optional)
  - `page`: Page number for pagination (optional, default: 1)
  - `perPage`: Number of items per page (optional, default: 10)
  - `month`: Month filter for sales (optional, default: 3)
- **Response:**
  - Status Code: 200 OK
  - Body: JSON object containing product details
  - Status Code: 500 Internal Server Error
  - Body: `{ error: 'Failed to list products' }`

### Get Statistics

- **URL:** `/roxiler/statistics`
- **Method:** GET
- **Description:** Retrieves statistics for sales, including total sale amount, total sold items, and total unsold items for a specific month.
- **Parameters:**
  - `month`: Month for which statistics are calculated (optional, default: 3)
- **Response:**
  - Status Code: 200 OK
  - Body: JSON object containing statistics data
  - Status Code: 500 Internal Server Error
  - Body: `{ error: 'Internal Server Error' }`

### Get Bar Chart Data

- **URL:** `/roxiler/bar-chart`
- **Method:** GET
- **Description:** Retrieves data for generating a bar chart representing the number of items sold within price ranges for a specific month.
- **Parameters:**
  - `month`: Month for which bar chart data is fetched (optional, default: 3)
- **Response:**
  - Status Code: 200 OK
  - Body: JSON object containing bar chart data
  - Status Code: 500 Internal Server Error
  - Body: `{ error: 'Internal Server Error' }`

### Get Pie Chart Data

- **URL:** `/roxiler/pie-chart`
- **Method:** GET
- **Description:** Retrieves data for generating a pie chart representing the distribution of items across categories for a specific month.
- **Parameters:**
  - `month`: Month for which pie chart data is fetched (optional, default: 3)
- **Response:**
  - Status Code: 200 OK
  - Body: JSON object containing pie chart data
  - Status Code: 500 Internal Server Error
  - Body: `{ error: 'Internal Server Error' }`

### Get Combined Data

- **URL:** `/roxiler/combined-data`
- **Method:** GET
- **Description:** Retrieves combined data from multiple endpoints for statistics, bar chart, and pie chart.
- **Parameters:**
  - `month`: onth for which combined data is fetched (optional, default: 3)
- **Response:**
  - Status Code: 200 OK
  - Body: JSON object containing combined data from all endpoints
  - Status Code: 500 Internal Server Error
  - Body: `{ error: 'Internal Server Error' }`

---

This README section provides an overview of each API endpoint, including its URL, method, description, parameters, and response format. Adjust the details as needed for your specific project requirements.
