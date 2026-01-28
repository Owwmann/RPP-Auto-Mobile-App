// ...existing imports...

suspend fun searchMechanics(lat: Double, lng: Double): List<Mechanic> {
    val params = mapOf("lat" to lat, "lng" to lng)
    val response = get("/api/v1/mechanics/search", params)
    return parseMechanics(response)
}

// ...existing code...
