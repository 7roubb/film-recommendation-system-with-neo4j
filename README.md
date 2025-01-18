# Movie Recommendation System
![image](https://github.com/user-attachments/assets/32223f84-47ee-48bb-b062-55bb0b6490ac)


This project implements a **Movie Recommendation System** using a **Backend API** built with **Python** and a **Neo4j** graph database for storing and retrieving movie data. The system generates personalized recommendations for users based on movie genres and user preferences.

## Table of Contents
- [Installation](#installation)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Project](#running-the-project)
- [Recommendation Logic](#recommendation-logic)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

- **Python 3.x**
- **Node.js** and **npm** (for the frontend)
- **Neo4j** (local or cloud instance)

### Backend Setup

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/yourusername/movie-recommendation-system.git
    cd movie-recommendation-system/backend
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

4. Ensure **Neo4j** is running on your machine or set up a cloud instance. Update your **Neo4j** credentials (`username`, `password`, and `uri`) in the configuration.

5. Load the movie data into Neo4j:
    - Prepare a CSV file (`movies.csv`) with the following columns: `movieId`, `Title`, `Genres`, `Poster Path`.
    - Run the script to load data:
    ```bash
    python load_movies.py
    ```

6. Once the data is loaded, you can start the backend API.

### Frontend Setup

1. Navigate to the **frontend** folder:
    ```bash
    cd ../project
    ```

2. Install the required **npm packages**:
    ```bash
    npm install
    ```

3. Make sure to configure the **backend API** URL in the frontend code to match the backend address (e.g., `http://localhost:5000`).

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

Once both the backend and frontend are running, you can access the project through:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## Recommendation Logic

The recommendation system in this project uses a **graph-based approach** with Neo4j to generate movie recommendations. The following steps outline how recommendations are generated:

1. **Graph Model**: Movies are represented as nodes, and relationships between movies are created based on shared genres. For example, if two movies have the same genre, they are connected with a `:SIMILAR_TO` relationship.

2. **Recommendation Algorithm**:
    - When a user interacts with a movie (e.g., watches a movie or likes it), the system recommends movies that are **similar** to the one they liked, based on shared genres or other attributes.
    - The backend uses a Cypher query to find similar movies by traversing the `:SIMILAR_TO` relationships in the graph.

3. **Collaborative Filtering**: Optionally, if user interaction data (e.g., ratings, views) is available, collaborative filtering algorithms can be applied using Neo4j’s graph traversal capabilities to recommend movies based on user similarities.
![image](https://github.com/user-attachments/assets/b1f5f015-4738-4ac9-bed6-8f1530926c90)
![image](https://github.com/user-attachments/assets/4f802ce7-2a56-4a1d-a08e-149db0e93bbd)


## API Endpoints

- **GET /movies**: Retrieves a list of all movies.
- **GET /movies/{movieId}**: Retrieves details of a specific movie by `movieId`.
- **GET /recommendations/{movieId}**: Retrieves a list of movie recommendations based on the `movieId` parameter.
- **POST /movies**: Adds a new movie to the database.
- **DELETE /movies/{movieId}**: Deletes a specific movie from the database.

Example request to get recommendations:
```bash
GET http://localhost:5000/recommendations/1
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

