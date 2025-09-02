export type MachineStatus =
	| 'AVAILABLE'
	| 'IN_USE'
	| 'COMPLETE'
  | 'UNAVAILABLE'

export type Machine = {
	id: string;
	number: number;
	type: 'washer' | 'dryer';
	status: MachineStatus;
	remaining_seconds: number;
	estimated_end: string; // ISO string, can be "0001-01-01T00:00:00Z" when unknown
	is_active?: boolean;
	// Enriched fields added in the loader
	room_id: string;
	room_name: string;
	building_id: string;
	building_name: string;
};

export type Building = {
	id: string;
	organization_name: string;
	image?: string;
};

export type PinnedMachine = {
	buildingId: string;
};

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