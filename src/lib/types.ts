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
  washers_available: number;
  washers_in_use: number;
  washers_complete: number;
  washers_error?: number;
  dryers_available: number;
  dryers_in_use: number;
  dryers_complete: number;
  dryers_error?: number;
  total_washers?: number;
  total_dryers?: number;
  total_machines?: number;
  total_in_use?: number;
  total_available?: number;
}

export interface BuildingResponse {
  building: {
    rooms: {
      room_name: string;
      room_id: string;
      building_id: string;
      machines: Machine[];
    }[];
  };
  stats: MachineStats;
} 