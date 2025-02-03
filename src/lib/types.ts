export interface Building {
  id: string;
  organization_name: string;
  created_at: string;
  updated_at: string;
}

export interface Machine {
  id: string;
  room_id: string;
  type: 'washer' | 'dryer';
  status: string;
  number: number;
  remaining_seconds: number;
  estimated_end: string;
  status_id: string;
  is_active: boolean;
  control_id: string;
  room_name: string;
  building_id: string;
  building_name: string;
}

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export interface MachineStats {
  total_machines: number;
  total_washers: number;
  total_dryers: number;
  washers_in_use: number;
  dryers_in_use: number;
  washers_available: number;
  dryers_available: number;
  washer_usage_percent: number;
  dryer_usage_percent: number;
  total_in_use: number;
  total_available: number;
  total_error: number;
  washers_complete: number;
  dryers_complete: number;
  washers_error: number;
  dryers_error: number;
}

export interface BuildingResponse {
  message: string;
  status: number;
  data: {
    building: {
      building_id: string;
      building_name: string;
      rooms: {
        room_id: string;
        room_name: string;
        building_id: string;
        machines: Machine[];
      }[];
    };
    stats: MachineStats;
  };
} 