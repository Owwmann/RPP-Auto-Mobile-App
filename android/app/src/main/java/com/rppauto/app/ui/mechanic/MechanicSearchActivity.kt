package com.rppauto.app.ui.mechanic

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.RecyclerView
import com.rppauto.app.R

class MechanicSearchActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_mechanic_search)
        val recyclerView = findViewById<RecyclerView>(R.id.recyclerMechanics)
        // TODO: Wire to API + adapter
    }
}