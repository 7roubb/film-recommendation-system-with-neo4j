from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from neo4j import GraphDatabase
import jwt
import datetime
from functools import wraps
from flask_cors import CORS
import logging
import os

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'your_jwt_secret_key')
NEO4J_URI = os.getenv('NEO4J_URI', 'bolt://localhost:7687')
NEO4J_USER = os.getenv('NEO4J_USER', 'neo4j')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD', 'securepassword123')

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

def handle_error(e, status_code=500):
    logger.error(f"Error: {str(e)}")
    return jsonify({"error": str(e)}), status_code

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'Token is missing or invalid!'}), 401
        try:
            token = auth_header.split(" ")[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated_function

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        with driver.session() as session:
            password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
            session.write_transaction(lambda tx: tx.run(
                "CREATE (u:User {username: $username, password: $password})",
                username=data['username'], password=password_hash))
        return jsonify({"message": "User created"}), 201
    except Exception as e:
        return handle_error(e)

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        with driver.session() as session:
            user = session.run("MATCH (u:User {username: $username}) RETURN u.password AS password",
                               username=data['username']).single()
            if user and bcrypt.check_password_hash(user['password'], data['password']):
                token = jwt.encode({
                    'username': data['username'],
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
                }, app.config['SECRET_KEY'], algorithm="HS256")
                return jsonify({"token": token}), 200
        return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        return handle_error(e)

@app.route('/movies', methods=['GET'])
@token_required
def get_movies(current_user):
    try:
        limit = int(request.args.get('limit', 10))
        skip = int(request.args.get('skip', 0))
        search = request.args.get('search', '')

        with driver.session() as session:
            query = """
            MATCH (m:Movie)
            OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
            WHERE m.title CONTAINS $search OR g.name CONTAINS $search
            RETURN m.id AS id, m.title AS title, COLLECT(g.name) AS genres,  m.poster_path AS poster_path
            SKIP $skip LIMIT $limit
            """
            result = session.run(query, search=search, skip=skip, limit=limit)
            movies = [{"id": record["id"], "title": record["title"], "genres": record["genres"],"poster_path": record["poster_path"]} for record in result]
        return jsonify(movies)
    except Exception as e:
        return handle_error(e)

@app.route('/add_movie', methods=['POST'])
@token_required
def add_movie(current_user):
    try:
        data = request.json
        movie_id = data['id']
        title = data['title']
        genres = data.get('genres', [])

        with driver.session() as session:
            session.write_transaction(
                lambda tx: tx.run(
                    """
                    MERGE (m:Movie {id: $movie_id, title: $title})
                    WITH m
                    UNWIND $genres AS genre
                    MERGE (g:Genre {name: genre})
                    MERGE (m)-[:HAS_GENRE]->(g)
                    """,
                    movie_id=movie_id, title=title, genres=genres
                )
            )
        return jsonify({"message": "Movie added with genres"}), 201
    except Exception as e:
        return handle_error(e)

@app.route('/rate_movie', methods=['POST'])
@token_required
def rate_movie(current_user):
    try:
        data = request.json
        movie_id = data['movie_id']
        rating = data['rating']
        
        with driver.session() as session:
            session.write_transaction(
                lambda tx: tx.run(
                    """
                    MATCH (u:User {username: $username}) 
                    MATCH (m:Movie {id: $movie_id})
                    MERGE (u)-[r:RATED]->(m)
                    SET r.rating = $rating
                    """,
                    username=current_user, movie_id=movie_id, rating=rating
                )
            )
        return jsonify({"message": "Rating submitted"}), 200
    except Exception as e:
        return handle_error(e)

@app.route('/watch_movie', methods=['POST'])
@token_required
def watch_movie(current_user):
    try:
        data = request.json
        movie_id = data['movie_id']
        with driver.session() as session:
            session.write_transaction(
                lambda tx: tx.run(
                    """
                    MATCH (u:User {username: $username}), (m:Movie {id: $movie_id})
                    MERGE (u)-[w:WATCHED]->(m)
                    ON CREATE SET w.timestamp = timestamp()
                    """,
                    username=current_user, movie_id=movie_id
                )
            )
        return jsonify({"message": "Movie marked as watched"}), 200
    except Exception as e:
        return handle_error(e)

@app.route('/history', methods=['GET'])
@token_required
def get_history(current_user):
    try:
        limit = int(request.args.get('limit', 10))
        skip = int(request.args.get('skip', 0))
        with driver.session() as session:
            query = """
            MATCH (u:User {username: $username})-[w:WATCHED]->(m:Movie)
            OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
            RETURN m.id AS id, m.title AS title, COLLECT(g.name) AS genres, w.timestamp AS watched_at
            ORDER BY w.timestamp DESC
            SKIP $skip LIMIT $limit
            """
            result = session.run(query, username=current_user, skip=skip, limit=limit)
            history = [{"id": record["id"], "title": record["title"], "genres": record["genres"], "watched_at": record["watched_at"]} for record in result]
        return jsonify(history), 200
    except Exception as e:
        return handle_error(e)
        
@app.route('/recommend_content', methods=['GET'])
@token_required
def recommend_content(current_user):
    try:
        limit = int(request.args.get('limit', 5))  
        with driver.session() as session:
            content_query = """
            MATCH (u:User {username: $username})-[:RATED|WATCHED]->(m:Movie)-[:HAS_GENRE]->(g:Genre)<-[:HAS_GENRE]-(rec:Movie)
            WHERE NOT EXISTS((u)-[:RATED|WATCHED]->(rec)) AND rec IS NOT NULL
            RETURN DISTINCT rec.id AS id, rec.title AS title, COLLECT(g.name) AS genres, rec.poster_path AS poster_path
            LIMIT $limit
            """
            content_result = session.run(content_query, username=current_user, limit=limit)
            content_recommendations = [
                {
                    "id": record["id"],
                    "title": record["title"],
                    "genres": record["genres"],
                    "poster_path": record["poster_path"]
                }
                for record in content_result
            ]

            user_query = """
            MATCH (u1:User {username: $username})-[r1:RATED|WATCHED]->(m:Movie)<-[r2:RATED|WATCHED]-(u2:User)
            WHERE u1 <> u2  
            
            WITH u1, u2, COLLECT(DISTINCT m.title) AS sharedMovies
            MATCH (u2)-[:RATED|WATCHED]->(rec:Movie)
            WHERE NOT (u1)-[:RATED|WATCHED]->(rec)
            OPTIONAL MATCH (rec)-[:HAS_GENRE]->(g:Genre)

            RETURN DISTINCT rec.id AS id, rec.title AS title, sharedMovies, rec.poster_path AS poster_path,
                   COLLECT(g.name) AS genres,
                   COUNT(DISTINCT u2) AS userCount
            ORDER BY userCount DESC, rec.title
            LIMIT $limit
            """
            user_result = session.run(user_query, username=current_user, limit=limit)
            user_recommendations = [
                {
                    "id": record["id"],
                    "title": record["title"],
                    "genres": record["genres"],
                    "poster_path": record["poster_path"],
                    "shared_movies": record["sharedMovies"],
                    "user_count": record["userCount"]
                }
                for record in user_result
            ]

        combined_recommendations = content_recommendations + user_recommendations

        return jsonify(combined_recommendations), 200
        return jsonify(response), 200

    except Exception as e:
        return handle_error(e)




@app.route('/search/movies', methods=['GET'])
@token_required
def search_movies(current_user):
    try:
        search = request.args.get('search', '').strip().lower()  
        limit = int(request.args.get('limit', 10))
        skip = int(request.args.get('skip', 0))

        with driver.session() as session:
            query = """
            MATCH (m:Movie)
            WHERE toLower(m.title) CONTAINS $search
            OPTIONAL MATCH (m)-[:HAS_GENRE]->(g:Genre)
            RETURN m.id AS id, m.title AS title ,COLLECT(g.name) AS genres,m.poster_path AS poster_path
            SKIP $skip LIMIT $limit
            """
            result = session.run(query, search=search, skip=skip, limit=limit)

            movies = [{"id": record["id"], "title": record["title"], "genres": record["genres"],"poster_path": record["poster_path"]} for record in result]

        return jsonify(movies), 200
    except Exception as e:
        return handle_error(e)

@app.route('/profile', methods=['GET'])
@token_required
def profile(current_user):
    try:
        with driver.session() as session:
            user = session.run("MATCH (u:User {username: $username}) RETURN u.username AS username",
                               username=current_user).single()
            if user:
                return jsonify({"username": user["username"]}), 200
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return handle_error(e)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Pong!"}), 200

@app.before_first_request
def setup():
    try:
        with driver.session() as session:
            logger.info("Application initialized and connected to Neo4j")
    except Exception as e:
        logger.error(f"Failed to initialize: {e}")

if __name__ == '__main__':
    app.run(debug=True)
