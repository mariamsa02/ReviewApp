from dotenv import load_dotenv
import os
import requests
load_dotenv()

# Get keys from environment
TMDB_API_KEY = os.environ.get('TMDB_API_KEY')
GOOGLE_BOOKS_API_KEY = os.environ.get('GOOGLE_BOOKS_API_KEY')

def query_api(category, query):
    if not query:
        return []

    # set up for API
    if category == "Book":
        url = "https://www.googleapis.com/books/v1/volumes"
        params = {
            "q": query,
            "maxResults": 10,
            "key": GOOGLE_BOOKS_API_KEY
        }
    else:
        # for TMDB
        media_type = "movie" if category == "Movie" else "tv"
        url = f"https://api.themoviedb.org/3/search/{media_type}"
        params = {
            "api_key": TMDB_API_KEY,
            "query": query,
            "page": 1
        }

    # Make the request
    try:
        # use params to clean url
        response = requests.get(url, params=params, timeout=5)
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error calling API: {e}")
        return []

    # Google Books uses items and TMDB uses results
    if category == "Book":
        return data.get("items", [])
    else:
        return data.get("results", [])

