# Mechanic Directory Feature

## Backend
- `/api/v1/mechanics/search?lat=...&lng=...` returns nearby mechanics using Google Places API

## Android
- `MechanicSearchActivity` displays search results using new API endpoint
- Update ApiService.kt to call backend mechanics search
