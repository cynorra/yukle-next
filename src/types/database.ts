export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: 'shipper' | 'driver';
  rating: number;
  is_verified: boolean;
  company_name: string | null;
  avatar_url: string | null;
  points: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_id: string | null;
  published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface City {
  id: number;
  name: string;
  plate_code: string | null;
}

export interface District {
  id: number;
  name: string;
  city_id: number;
}

export interface Load {
  id: string;
  title: string;
  shipper_id: string;
  origin_city: string;
  origin_state: string | null;
  origin_country: string;
  destination_city: string;
  destination_state: string | null;
  destination_country: string;
  price: number | null;
  load_type: string;
  required_truck_type: string | null;
  weight_ton: number;
  description: string | null;
  pickup_date: string | null;
  delivery_date: string | null;
  tags: string[];
  status: 'active' | 'in_transit' | 'completed' | 'cancelled';
  assigned_driver_id: string | null;
  shipper_confirmed: boolean;
  driver_confirmed: boolean;
  shipper_confirmed_at: string | null;
  driver_confirmed_at: string | null;
  shipper?: Profile;
  created_at: string;
}

export interface DriverRoute {
  id: string;
  driver_id: string;
  origin_city: string;
  origin_state: string | null;
  origin_country: string;
  destination_city: string;
  destination_state: string | null;
  destination_country: string;
  departure_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  load_id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  phone_shared_by: string | null;
  phone_shared_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  load_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  description: string;
  load_id: string | null;
  read: boolean;
  created_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  description: string | null;
  related_load_id: string | null;
  created_at: string;
}

export const POINT_REWARDS = {
  register: 50,
  create_load_first: 100,
  create_load: 20,
  load_completed: 200,
  profile_complete: 30,
  daily_login: 10,
  first_message: 20,
} as const;
