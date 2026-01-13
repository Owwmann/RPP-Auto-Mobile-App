package com.rppauto.app.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.rppauto.app.R
import com.rppauto.app.data.api.ApiService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MechanicSearchActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_search_mechanics)

        val recyclerView = findViewById<RecyclerView>(R.id.mechanicsRecycler)
        recyclerView.layoutManager = LinearLayoutManager(this)
        CoroutineScope(Dispatchers.Main).launch {
            val lat = intent.getDoubleExtra("lat", 0.0)
            val lng = intent.getDoubleExtra("lng", 0.0)
            val mechanics = ApiService.searchMechanics(lat, lng)
            recyclerView.adapter = MechanicsAdapter(mechanics)
        }
    }
}
