# Movie Database Project

This project consists of a **Backend API** implemented with Python and **Neo4j** as the database, along with a **Frontend** built using **React**. The backend loads movie data from a CSV file into a Neo4j database and provides endpoints to interact with the movie data.

## Table of Contents
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- **Python 3.x**  
- **Node.js** and **npm** (for the frontend)
- **Neo4j** (You can run it locally or use a cloud-based instance)

### Backend Setup

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/yourusername/movie-database-project.git
    cd movie-database-project/backend
    ```

2. Create a **virtual environment** and activate it:
    ```bash
    python -m venv venv
    # On Windows
    venv\Scripts\activate
    # On MacOS/Linux
    source venv/bin/activate
    ```

3. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

4. Make sure **Neo4j** is running on your machine or set up a cloud instance. Configure the `neo4j` credentials (`username`, `password`, and `uri`) in your environment or settings.

5. Load movie data into the Neo4j database:
    - Prepare a CSV file (`movies.csv`) with the movie data.
    - Ensure the file contains the following columns: `movieId`, `Title`, `Genres`, `Poster Path`.
    - Run the script to load the data:
    ```bash
    python load_movies.py
    ```

### Frontend Setup

1. Navigate to the **frontend** folder:
    ```bash
    cd ../frontend
    ```

2. Install the required **npm packages**:
    ```bash
    npm install
    ```

3. Make sure to configure the **backend API** endpoint URL in your frontend code (in `src/api.js` or equivalent). It should point to your backend API (e.g., `http://localhost:5000/api`).

## Running the Project

### Running Backend

1. Start the backend server:
    ```bash
    python app.py
    ```

2. The backend API will be running on `http://localhost:5000`.

### Running Frontend

1. Start the frontend development server:
    ```bash
    npm start
    ```

2. The frontend will be accessible at `http://localhost:3000`.

### Full Stack Setup

Once both the backend and frontend are running, you can access the project through the following URLs:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## API Endpoints

- **GET /movies**: Retrieves a list of all movies from the database.
- **GET /movies/{movieId}**: Retrieves details of a specific movie by `movieId`.
- **POST /movies**: Adds a new movie to the database (useful for testing or adding movies manually).
- **DELETE /movies/{movieId}**: Deletes a specific movie from the database.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

