from fastapi import APIRouter, Query
from app.services.google_maps_service import search_mechanics_near_location
from typing import List, Optional

router = APIRouter()

@router.get("/search")
def search_mechanics(lat: float = Query(...), lon: float = Query(...), radius: int = Query(5000)):
    """
    Returns a list of mechanic locations near the given latitude and longitude using Google Places.
    """
    return search_mechanics_near_location(lat, lon, radius)
