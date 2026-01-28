package com.rppauto.app.ui.diagnostics

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import com.rppauto.app.databinding.ActivityScanBinding
import com.rppauto.app.viewmodel.ScanViewModel

class ScanActivity : AppCompatActivity() {

    private lateinit var binding: ActivityScanBinding
    private lateinit var viewModel: ScanViewModel
    private var bluetoothAdapter: BluetoothAdapter? = null

    companion object {
        private const val REQUEST_ENABLE_BT = 1
        private const val REQUEST_BLUETOOTH_PERMISSIONS = 2
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityScanBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[ScanViewModel::class.java]

        setupUI()
        checkBluetoothSupport()
        observeViewModel()
    }

    private fun setupUI() {
        binding.btnSelectAdapter.setOnClickListener {
            showAdapterSelectionDialog()
        }

        binding.btnStartScan.setOnClickListener {
            startDiagnosticScan()
        }

        binding.btnStopScan.setOnClickListener {
            stopDiagnosticScan()
        }
    }

    private fun checkBluetoothSupport() {
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter()

        if (bluetoothAdapter == null) {
            Toast.makeText(this, "Bluetooth not supported", Toast.LENGTH_LONG).show()
            finish()
            return
        }

        if (bluetoothAdapter?.isEnabled == false) {
            val enableBtIntent = Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE)
            startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT)
        }
    }

    private fun showAdapterSelectionDialog() {
        // Get paired Bluetooth devices
        val pairedDevices: Set<BluetoothDevice>? = bluetoothAdapter?.bondedDevices

        if (pairedDevices.isNullOrEmpty()) {
            Toast.makeText(this, "No paired OBD2 adapters found", Toast.LENGTH_SHORT).show()
            return
        }

        val deviceNames = pairedDevices.map { it.name }.toTypedArray()

        android.app.AlertDialog.Builder(this)
            .setTitle("Select OBD2 Adapter")
            .setItems(deviceNames) { _, which ->
                val selectedDevice = pairedDevices.elementAt(which)
                viewModel.selectAdapter(selectedDevice)
                binding.tvSelectedAdapter.text = selectedDevice.name
            }
            .show()
    }

    private fun startDiagnosticScan() {
        val vehicleId = intent.getStringExtra("vehicle_id")
        if (vehicleId == null) {
            Toast.makeText(this, "Please select a vehicle first", Toast.LENGTH_SHORT).show()
            return
        }

        binding.btnStartScan.isEnabled = false
        binding.progressBar.visibility = android.view.View.VISIBLE

        viewModel.startScan(vehicleId)
    }

    private fun stopDiagnosticScan() {
        viewModel.stopScan()
        binding.btnStartScan.isEnabled = true
        binding.progressBar.visibility = android.view.View.GONE
    }

    private fun observeViewModel() {
        viewModel.scanStatus.observe(this) { status ->
            binding.tvStatus.text = status
        }

        viewModel.dtcCodes.observe(this) { codes ->
            binding.tvDtcCount.text = "Found ${codes.size} codes"
            // Update RecyclerView with codes
        }

        viewModel.scanComplete.observe(this) { reportId ->
            binding.progressBar.visibility = android.view.View.GONE

            // Navigate to report
            val intent = Intent(this, ReportActivity::class.java)
            intent.putExtra("report_id", reportId)
            startActivity(intent)
            finish()
        }

        viewModel.error.observe(this) { error ->
            Toast.makeText(this, error, Toast.LENGTH_LONG).show()
            binding.progressBar.visibility = android.view.View.GONE
            binding.btnStartScan.isEnabled = true
        }
    }
}
