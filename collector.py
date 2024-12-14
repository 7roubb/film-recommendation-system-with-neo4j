import csv
from neo4j import GraphDatabase

uri = "bolt://localhost:7687" 
username = "neo4j"
password = "securepassword123"

driver = GraphDatabase.driver(uri, auth=(username, password))

def insert_movie(session, movie_id, title, genres, poster_path):
    cypher_query = """
    MERGE (m:Movie {id: $movie_id, title: $title, poster_path: $poster_path})
    WITH m
    UNWIND $genres AS genre
    MERGE (g:Genre {name: genre})
    MERGE (m)-[:HAS_GENRE]->(g)
    """
    
    session.run(cypher_query, movie_id=movie_id, title=title, poster_path=poster_path, genres=genres)

def load_csv_to_neo4j(csv_file_path):
    with open(csv_file_path, 'r', encoding='utf-8') as csv_file:
        reader = csv.DictReader(csv_file)

        with driver.session() as session:
            for row in reader:
                movie_id = row['movieId']
                title = row['Title']
                genres = row['Genres'].split(',') 
                poster_path = row['Poster Path']
                
                insert_movie(session, int(movie_id), title, genres, poster_path)

    print(f"Data from {csv_file_path} has been loaded into Neo4j successfully.")

load_csv_to_neo4j('movies.csv')  
