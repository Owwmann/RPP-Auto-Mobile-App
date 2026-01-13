package com.rppauto.app.data.api

import com.rppauto.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // Authentication
    @POST("api/v1/auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("api/v1/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    // User
    @GET("api/v1/users/me")
    suspend fun getCurrentUser(): Response<User>

    @PUT("api/v1/users/me")
    suspend fun updateUser(@Body request: UpdateUserRequest): Response<ApiResponse>

    // Vehicles
    @GET("api/v1/vehicles")
    suspend fun getVehicles(): Response<VehiclesResponse>

    @POST("api/v1/vehicles")
    suspend fun createVehicle(@Body request: CreateVehicleRequest): Response<VehicleResponse>

    @GET("api/v1/vehicles/{id}")
    suspend fun getVehicle(@Path("id") vehicleId: String): Response<Vehicle>

    @PUT("api/v1/vehicles/{id}")
    suspend fun updateVehicle(
        @Path("id") vehicleId: String,
        @Body request: UpdateVehicleRequest
    ): Response<ApiResponse>

    @DELETE("api/v1/vehicles/{id}")
    suspend fun deleteVehicle(@Path("id") vehicleId: String): Response<ApiResponse>

    // Diagnostics
    @POST("api/v1/diagnostics/scan")
    suspend fun startDiagnosticScan(@Body request: ScanRequest): Response<ScanResponse>

    @GET("api/v1/diagnostics/reports")
    suspend fun getReports(@Query("vehicle_id") vehicleId: String? = null): Response<ReportsResponse>

    @GET("api/v1/diagnostics/reports/{id}")
    suspend fun getReport(@Path("id") reportId: String): Response<DiagnosticReport>

    // Payments
    @POST("api/v1/payments/subscribe")
    suspend fun subscribe(@Body request: SubscribeRequest): Response<SubscriptionResponse>

    @DELETE("api/v1/payments/subscription")
    suspend fun cancelSubscription(): Response<ApiResponse>
}
