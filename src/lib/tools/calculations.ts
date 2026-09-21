// Pure calculation helpers for the /tools calculators. No React, no I/O - so the
// numbers printed in the worked examples on each page are computed with exactly the
// same functions the calculators use (they cannot drift apart).

export const KM_PER_MILE = 1.609344;
export const LITERS_PER_US_GALLON = 3.785411784;
/** L/100 km = 235.214583 / mpg (US gallons). */
export const L100_PER_MPG = 235.214583;

// ---------------------------------------------------------------------------
// Dimensional (volumetric) weight
// ---------------------------------------------------------------------------

export type UnitSystem = 'imperial' | 'metric';

export interface DivisorPreset {
  id: string;
  system: UnitSystem;
  /** cubic inches per pound (imperial) or cubic centimetres per kilogram (metric) */
  divisor: number;
  label: string;
}

/**
 * Divisors that are widely used. Carriers publish and change their own, which is why the
 * calculator also accepts a custom divisor and every page tells the reader to confirm it.
 */
export const DIVISOR_PRESETS: DivisorPreset[] = [
  { id: 'us-139', system: 'imperial', divisor: 139, label: '139 in³ per lb (common US parcel divisor)' },
  { id: 'us-166', system: 'imperial', divisor: 166, label: '166 in³ per lb (older / retail parcel divisor)' },
  { id: 'air-5000', system: 'metric', divisor: 5000, label: '5,000 cm³ per kg (express / courier air)' },
  { id: 'air-6000', system: 'metric', divisor: 6000, label: '6,000 cm³ per kg (IATA air cargo standard, 167 kg/m³)' },
  { id: 'sea-1000', system: 'metric', divisor: 1000, label: '1,000 cm³ per kg (sea LCL: 1 m³ = 1,000 kg)' },
];

export interface DimWeightInput {
  length: number;
  width: number;
  height: number;
  divisor: number;
  quantity: number;
  actualWeightPerPiece: number;
  /** Round each dimension up to the next whole unit before multiplying (some carriers do). */
  roundUp: boolean;
}

export interface DimWeightResult {
  volumePerPiece: number;
  dimWeightPerPiece: number;
  totalDimWeight: number;
  totalActualWeight: number;
  chargeableWeight: number;
  billedOn: 'dimensional' | 'actual';
}

export function dimensionalWeight(i: DimWeightInput): DimWeightResult | null {
  const vals = [i.length, i.width, i.height, i.divisor, i.quantity, i.actualWeightPerPiece];
  if (vals.some((v) => !Number.isFinite(v)) || i.length <= 0 || i.width <= 0 || i.height <= 0) return null;
  if (i.divisor <= 0 || i.quantity < 1 || i.actualWeightPerPiece < 0) return null;

  const r = (v: number) => (i.roundUp ? Math.ceil(v) : v);
  const volumePerPiece = r(i.length) * r(i.width) * r(i.height);
  const dimWeightPerPiece = volumePerPiece / i.divisor;
  const totalDimWeight = dimWeightPerPiece * i.quantity;
  const totalActualWeight = i.actualWeightPerPiece * i.quantity;
  const billedOn = totalDimWeight > totalActualWeight ? 'dimensional' : 'actual';
  return {
    volumePerPiece,
    dimWeightPerPiece,
    totalDimWeight,
    totalActualWeight,
    chargeableWeight: Math.max(totalDimWeight, totalActualWeight),
    billedOn,
  };
}

// ---------------------------------------------------------------------------
// Fuel cost
// ---------------------------------------------------------------------------

export type DistanceUnit = 'mi' | 'km';
export type EconomyUnit = 'mpg' | 'l100km';
export type PriceUnit = 'gal' | 'l';

export interface FuelInput {
  distance: number;
  distanceUnit: DistanceUnit;
  economy: number;
  economyUnit: EconomyUnit;
  price: number;
  priceUnit: PriceUnit;
  roundTrip: boolean;
}

export interface FuelResult {
  totalDistance: number; // in the chosen distance unit
  liters: number;
  gallons: number;
  totalCost: number;
  costPerDistanceUnit: number; // per mile or per km, as chosen
}

export function fuelCost(i: FuelInput): FuelResult | null {
  const vals = [i.distance, i.economy, i.price];
  if (vals.some((v) => !Number.isFinite(v)) || i.distance <= 0 || i.economy <= 0 || i.price < 0) return null;

  const totalDistance = i.roundTrip ? i.distance * 2 : i.distance;
  const km = i.distanceUnit === 'mi' ? totalDistance * KM_PER_MILE : totalDistance;
  const l100 = i.economyUnit === 'mpg' ? L100_PER_MPG / i.economy : i.economy;
  const liters = (km * l100) / 100;
  const gallons = liters / LITERS_PER_US_GALLON;
  const pricePerLiter = i.priceUnit === 'gal' ? i.price / LITERS_PER_US_GALLON : i.price;
  const totalCost = liters * pricePerLiter;
  return { totalDistance, liters, gallons, totalCost, costPerDistanceUnit: totalCost / totalDistance };
}

// ---------------------------------------------------------------------------
// Detention
// ---------------------------------------------------------------------------

export interface DetentionInput {
  hoursOnSite: number;
  minutesOnSite: number;
  freeHours: number;
  ratePerHour: number;
  /** Billing increment in minutes (e.g. 15, 30, 60). Partial increments are rounded up. */
  incrementMinutes: number;
  /** Optional maximum charge for the stop; 0 or NaN means no cap. */
  cap: number;
}

export interface DetentionResult {
  minutesOnSite: number;
  freeMinutes: number;
  minutesOverFree: number;
  billableMinutes: number;
  fee: number;
  capApplied: boolean;
}

export function detentionFee(i: DetentionInput): DetentionResult | null {
  const vals = [i.hoursOnSite, i.minutesOnSite, i.freeHours, i.ratePerHour, i.incrementMinutes];
  if (vals.some((v) => !Number.isFinite(v))) return null;
  if (i.hoursOnSite < 0 || i.minutesOnSite < 0 || i.freeHours < 0 || i.ratePerHour < 0 || i.incrementMinutes < 1) return null;

  const minutesOnSite = i.hoursOnSite * 60 + i.minutesOnSite;
  const freeMinutes = i.freeHours * 60;
  const minutesOverFree = Math.max(0, minutesOnSite - freeMinutes);
  const billableMinutes = Math.ceil(minutesOverFree / i.incrementMinutes) * i.incrementMinutes;
  const uncapped = (billableMinutes / 60) * i.ratePerHour;
  const hasCap = Number.isFinite(i.cap) && i.cap > 0;
  const capApplied = hasCap && uncapped > i.cap;
  return { minutesOnSite, freeMinutes, minutesOverFree, billableMinutes, fee: capApplied ? i.cap : uncapped, capApplied };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function fmtMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = Math.round(total - h * 60);
  return `${h} h ${m} min`;
}
