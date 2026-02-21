// RPP AUTO - Screen Asset Configuration
// All 36 screens mapped to app components
// Replace with actual PNG exports when available

export const SCREEN_ASSETS = {
  // Authentication (Screens 1-3)
  screen01_boot:        require('./screen01_boot.png'),        // Splash/Boot screen
  screen02_login:       require('./screen02_login.png'),       // Login authentication
  screen03_register:    require('./screen03_register.png'),    // Register new unit

  // Dashboard (Screens 4-10)
  screen04_dashboard:   require('./screen04_dashboard.png'),   // Main dashboard
  screen05_fleet:       require('./screen05_fleet.png'),       // Fleet overview
  screen06_vehicle:     require('./screen06_vehicle.png'),     // Vehicle detail card
  screen07_recalls:     require('./screen07_recalls.png'),     // TSB & recalls panel
  screen08_alerts:      require('./screen08_alerts.png'),      // Active alerts
  screen09_weather:     require('./screen09_weather.png'),     // Weather integration
  screen10_quickact:    require('./screen10_quickact.png'),    // Quick actions grid

  // Diagnostics (Screens 11-18)
  screen11_scan_menu:   require('./screen11_scan_menu.png'),   // Scan selection
  screen12_scanning:    require('./screen12_scanning.png'),    // Active scan animation
  screen13_obd2:        require('./screen13_obd2.png'),        // OBD2 connection
  screen14_ai_consult:  require('./screen14_ai_consult.png'),  // AI assistant chat
  screen15_dtc_result:  require('./screen15_dtc_result.png'),  // DTC code results
  screen16_wiring:      require('./screen16_wiring.png'),      // OEM wiring diagram
  screen17_parts:       require('./screen17_parts.png'),       // Required parts list
  screen18_repair_steps:require('./screen18_repair_steps.png'),// AI repair protocol

  // Resources Hub (Screens 19-24)
  screen19_resources:   require('./screen19_resources.png'),   // Resources grid
  screen20_emergency:   require('./screen20_emergency.png'),   // Emergency power
  screen21_chemicals:   require('./screen21_chemicals.png'),   // Chemical repair
  screen22_fluids:      require('./screen22_fluids.png'),      // Fluids & additives
  screen23_tools:       require('./screen23_tools.png'),       // Inspection tools
  screen24_accessories: require('./screen24_accessories.png'), // Security & cams

  // Community (Screens 25-29)
  screen25_community:   require('./screen25_community.png'),   // Community grid
  screen26_forum_post:  require('./screen26_forum_post.png'),  // Post detail view
  screen27_video_feed:  require('./screen27_video_feed.png'),  // Educational videos
  screen28_filter:      require('./screen28_filter.png'),      // Topic filters
  screen29_new_post:    require('./screen29_new_post.png'),    // Create new post

  // Mechanic Booking (Screens 30-32)
  screen30_book:        require('./screen30_book.png'),        // Mechanic list
  screen31_mechanic:    require('./screen31_mechanic.png'),    // Mechanic profile
  screen32_payment:     require('./screen32_payment.png'),     // Stripe payment

  // Profile (Screens 33-36)
  screen33_profile:     require('./screen33_profile.png'),     // User profile
  screen34_garage:      require('./screen34_garage.png'),      // Vehicle garage
  screen35_settings:    require('./screen35_settings.png'),    // App settings
  screen36_web_portal:  require('./screen36_web_portal.png'),  // Web portal access
};
