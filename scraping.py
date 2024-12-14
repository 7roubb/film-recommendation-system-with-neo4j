import requests
import csv
import time
import os


API_KEY = "718b589b133e1b14a711ba40ad759541"

BASE_URL = "https://api.themoviedb.org/3"

def fetch_genres():
    genre_url = f"{BASE_URL}/genre/movie/list?api_key={API_KEY}&language=en-US"
    response = requests.get(genre_url)
    if response.status_code == 200:
        genres = response.json().get("genres", [])
        return {genre["id"]: genre["name"] for genre in genres}
    else:
        print("Error fetching genres:", response.status_code, response.text)
        return {}

def fetch_movies(category, page=1):
    url = f"{BASE_URL}/movie/{category}?api_key={API_KEY}&language=en-US&page={page}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("results", [])
    else:
        print(f"Error fetching movies ({category} - Page {page}):", response.status_code, response.text)
        return []

def save_movies_to_csv(file_name, start_page=1, end_page=500, category="popular"): 
    genre_dict = fetch_genres() 
    all_movies = []

    for page in range(start_page, end_page + 1):
        print(f"Fetching {category} movies from page {page}...")
        movies = fetch_movies(category, page)
        for movie in movies:
            movie_data = {
                "Title": movie.get("title"),
                "Name": movie.get("original_title"),
                "Genres": ", ".join([genre_dict.get(genre_id, "Unknown") for genre_id in movie.get("genre_ids", [])]),
                "Poster Path": f"https://image.tmdb.org/t/p/w500{movie.get('poster_path')}" if movie.get('poster_path') else None,
            }
            all_movies.append(movie_data)

        time.sleep(0.5)  

    file_exists = os.path.exists(file_name)
    with open(file_name, mode="a", newline="", encoding="utf-8") as csv_file:
        fieldnames = ["Title", "Name", "Genres", "Poster Path"]
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader() 
        writer.writerows(all_movies)

    print(f"{category.capitalize()} movies from pages {start_page} to {end_page} saved to {file_name} successfully.")

if __name__ == "__main__":
    categories = ["popular", "top_rated", "now_playing", "upcoming"]
    for category in categories:
        save_movies_to_csv("movies.csv", start_page=1, end_page=500, category=category)  
