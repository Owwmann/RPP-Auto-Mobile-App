from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import requests
import os

router = APIRouter()

GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY", "AIzaSyBP32CIk3aifHzyoRSED24WGn6yGFLYkvE")
BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"

@router.get("/api/v1/mechanics/search", response_model=List[dict])
def search_mechanics(lat: float = Query(...), lng: float = Query(...), radius: int = Query(5000)):
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "car_repair",
        "key": GOOGLE_PLACES_API_KEY
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch mechanic data")
    data = response.json().get("results", [])
    # Return mechanics list
    return [{
        "name": m.get("name"),
        "address": m.get("vicinity"),
        "rating": m.get("rating"),
        "place_id": m.get("place_id"),
        "lat": m.get("geometry", {}).get("location", {}).get("lat"),
        "lng": m.get("geometry", {}).get("location", {}).get("lng")
    } for m in data]