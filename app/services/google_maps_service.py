import os
import requests

GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")

def search_mechanics_near_location(lat, lon, radius):
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "key": GOOGLE_MAPS_API_KEY,
        "location": f"{lat},{lon}",
        "radius": radius,
        "type": "car_repair"
    }
    resp = requests.get(url, params=params)
    resp.raise_for_status()
    data = resp.json()
    results = data.get("results", [])
    # Minimal transformation for now, can be expanded with more fields
    return [
        {
            "name": m.get("name"),
            "address": m.get("vicinity"),
            "place_id": m.get("place_id"),
            "rating": m.get("rating"),
            "user_ratings_total": m.get("user_ratings_total"),
            "location": m["geometry"]["location"] if m.get("geometry") else None
        }
        for m in results
    ]
