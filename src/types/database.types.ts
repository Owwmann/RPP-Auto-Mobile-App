// Database types generated from Supabase schema
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  profile_image_url: string | null;
  timezone: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  engine: string | null;
  transmission: string | null;
  fuel_type: string | null;
  mileage: number | null;
  license_plate: string | null;
  color: string | null;
  nickname: string | null;
  is_primary: boolean;
  vehicle_image_url: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticCode {
  id: string;
  code: string;
  code_type: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string | null;
  recommended_action: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface VehicleDiagnostic {
  id: string;
  vehicle_id: string;
  diagnostic_code_id: string;
  detected_at: string;
  resolved_at: string | null;
  status: 'active' | 'resolved' | 'ignored';
  user_notes: string | null;
  ai_analysis: string | null;
  sensor_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}
