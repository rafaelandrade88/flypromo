export type PriceCategory = 'low' | 'medium' | 'high'

export interface Airport {
  airport: string
  city: string
  time: string
  terminal?: string | null
}

export interface FlightPrice {
  total: number
  currency: string
  category: PriceCategory
  savings: number | null
}

export interface ReturnFlight {
  departure: Omit<Airport, 'terminal'>
  arrival: Omit<Airport, 'terminal'>
}

export interface Flight {
  id: string
  price: FlightPrice
  departure: Airport
  arrival: Airport
  returnFlight?: ReturnFlight
  duration: string
  durationMinutes: number
  stops: number
  airlines: string[]
  flightNumbers: string[]
  cabin: string
  bookingLink: string
  extensions: string[]
}

export interface SearchStats {
  total: number
  avgPrice: number
  minPrice: number
  maxPrice: number
  currency: string
}

export interface SearchResponse {
  flights: Flight[]
  stats: SearchStats | null
  error?: string
}

export interface SearchParams {
  originCode: string
  destinationCode: string
  departureDate: string
  returnDate?: string
  adults: number
  children: number
}

export interface Recommendation {
  rank: number
  destination: string
  country: string
  iataCode: string
  estimatedPrice: string
  bestMonths: string[]
  highlights: string[]
  tip: string
  priceCategory: PriceCategory
  bookingUrl: string
}

export interface RecommendationResponse {
  recommendations: Recommendation[]
  generalTip?: string
  error?: string
}

export interface RecommendationParams {
  origin: string
  budget: string | null
  travelMonth: string | null
  adults: number
  children: number
  preferences: string | null
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  preferred_origin: string | null
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: string
  user_id: string
  flight_offer: Flight
  origin_code: string
  destination_code: string
  departure_date: string
  price: number
  currency: string
  airline: string | null
  booking_url: string | null
  notes: string | null
  created_at: string
}

export interface SearchHistory {
  id: string
  user_id: string
  origin_code: string
  origin_name: string | null
  destination_code: string
  destination_name: string | null
  departure_date: string
  return_date: string | null
  adults: number
  children: number
  results_count: number
  min_price: number | null
  currency: string
  created_at: string
}
