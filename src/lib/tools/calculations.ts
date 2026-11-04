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

// ---------------------------------------------------------------------------
// Federal Bridge Formula (23 CFR 658.17; FHWA "Bridge Formula Weights")
// ---------------------------------------------------------------------------

export interface BridgeFormulaResult {
  /** W before rounding: 500 * (L*N/(N-1) + 12N + 36) */
  rawWeight: number;
  /** W rounded to the nearest 500 lb; exact halves round down, as in FHWA's Bridge Table. */
  formulaWeight: number;
  /** The formula weight limited by the 80,000 lb gross limit. */
  limit: number;
  cappedAtGross: boolean;
}

/** W = 500 x [ (L x N / (N - 1)) + 12N + 36 ]; N axles in the group, L feet between the outer axles. */
export function bridgeFormula(axles: number, spanFeet: number): BridgeFormulaResult | null {
  if (!Number.isFinite(axles) || !Number.isFinite(spanFeet)) return null;
  if (!Number.isInteger(axles) || axles < 2 || spanFeet <= 0) return null;
  const rawWeight = 500 * ((spanFeet * axles) / (axles - 1) + 12 * axles + 36);
  // Nearest 500 lb, rounding DOWN when exactly halfway: FHWA's Bridge Table (FHWA-HOP-19-028, footnote 1) states this policy.
  const formulaWeight = Math.ceil(rawWeight / 500 - 0.5 - 1e-9) * 500;
  const limit = Math.min(formulaWeight, 80000);
  return { rawWeight, formulaWeight, limit, cappedAtGross: formulaWeight > 80000 };
}

// ---------------------------------------------------------------------------
// Hours of service clocks for property-carrying drivers (49 CFR 395.3(a)-(b))
// ---------------------------------------------------------------------------

export type HosLimit = 'driving' | 'window' | 'break' | 'cycle';

export interface HosClocksInput {
  /** Minutes after midnight when the driver came on duty after 10+ consecutive hours off duty. */
  onDutyStartMin: number;
  /** Minutes after midnight "now" (same calendar day as the start, or later if the shift crosses midnight; pass minutes since the start day's midnight). */
  nowMin: number;
  /** Driving hours so far in this shift. */
  drivingHours: number;
  /** Hours of driving since the last interruption of at least 30 consecutive minutes (off duty, sleeper berth or on duty not driving). */
  drivingSinceBreakHours: number;
  /** Hours on duty so far in the current 7- or 8-day period, including this shift. */
  cycleUsedHours: number;
  /** 60 (7-day) or 70 (8-day) */
  cycleLimitHours: number;
}

export interface HosClocksResult {
  drivingLeftHours: number;
  /** Minutes after midnight when driving must stop because the 14-hour period ends. */
  windowEndMin: number;
  windowLeftHours: number;
  hoursUntilBreakNeeded: number;
  cycleLeftHours: number;
  /** Hours the driver can still drive before the first limit is reached. */
  maxDrivableHours: number;
  bindingLimit: HosLimit;
}

/**
 * Simple single-shift check; does not model sleeper-berth splits or the short-haul exceptions.
 * The 30-minute break limits driving to 8 hours between interruptions; once taken, the 11-hour,
 * 14-hour and cycle limits still apply.
 */
export function hosClocks(i: HosClocksInput): HosClocksResult | null {
  const nums = [i.onDutyStartMin, i.nowMin, i.drivingHours, i.drivingSinceBreakHours, i.cycleUsedHours, i.cycleLimitHours];
  if (nums.some((n) => !Number.isFinite(n)) || i.drivingHours < 0 || i.drivingSinceBreakHours < 0 || i.cycleUsedHours < 0) return null;
  if (i.cycleLimitHours !== 60 && i.cycleLimitHours !== 70) return null;
  if (i.nowMin < i.onDutyStartMin) return null;
  const drivingLeft = Math.max(0, 11 - i.drivingHours);
  const windowEndMin = i.onDutyStartMin + 14 * 60;
  const windowLeft = Math.max(0, (windowEndMin - i.nowMin) / 60);
  const untilBreak = Math.max(0, 8 - i.drivingSinceBreakHours);
  const cycleLeft = Math.max(0, i.cycleLimitHours - i.cycleUsedHours);
  const candidates: Array<[HosLimit, number]> = [['driving', drivingLeft], ['window', windowLeft], ['break', untilBreak], ['cycle', cycleLeft]];
  const [bindingLimit, maxDrivableHours] = candidates.reduce((a, b) => (b[1] < a[1] ? b : a));
  return { drivingLeftHours: drivingLeft, windowEndMin, windowLeftHours: windowLeft, hoursUntilBreakNeeded: untilBreak, cycleLeftHours: cycleLeft, maxDrivableHours, bindingLimit };
}

// ---------------------------------------------------------------------------
// LTL density (NMFTA: cubic inches / 1,728 = cubic feet; pounds / cubic feet = pcf)
// ---------------------------------------------------------------------------

export interface LtlDensityResult {
  cubicInches: number;
  cubicFeet: number;
  densityPcf: number;
  totalWeight: number;
  totalCubicFeet: number;
}

export function ltlDensity(i: { length: number; width: number; height: number; weight: number; units: number }): LtlDensityResult | null {
  const vals = [i.length, i.width, i.height, i.weight, i.units];
  if (vals.some((v) => !Number.isFinite(v)) || i.length <= 0 || i.width <= 0 || i.height <= 0 || i.weight <= 0 || i.units < 1) return null;
  const cubicInches = i.length * i.width * i.height;
  const cubicFeet = cubicInches / 1728;
  return {
    cubicInches,
    cubicFeet,
    densityPcf: i.weight / cubicFeet,
    totalWeight: i.weight * i.units,
    totalCubicFeet: cubicFeet * i.units,
  };
}

/**
 * NMFC standard 13-step density scale (Docket 2025-1, in effect 19 July 2025).
 * Applies only to items rated on the standard density scale (no handling, stowability or
 * liability issues). Lower bound inclusive, upper bound exclusive. Classes 77.5, 110, 200 and 500
 * are not part of this scale. Always confirm the item and its class in NMFTA's ClassIT+.
 */
export const NMFC_STANDARD_DENSITY_SCALE: ReadonlyArray<{ minPcf: number; maxPcf: number; freightClass: number }> = [
  { minPcf: 0, maxPcf: 1, freightClass: 400 },
  { minPcf: 1, maxPcf: 2, freightClass: 300 },
  { minPcf: 2, maxPcf: 4, freightClass: 250 },
  { minPcf: 4, maxPcf: 6, freightClass: 175 },
  { minPcf: 6, maxPcf: 8, freightClass: 125 },
  { minPcf: 8, maxPcf: 10, freightClass: 100 },
  { minPcf: 10, maxPcf: 12, freightClass: 92.5 },
  { minPcf: 12, maxPcf: 15, freightClass: 85 },
  { minPcf: 15, maxPcf: 22.5, freightClass: 70 },
  { minPcf: 22.5, maxPcf: 30, freightClass: 65 },
  { minPcf: 30, maxPcf: 35, freightClass: 60 },
  { minPcf: 35, maxPcf: 50, freightClass: 55 },
  { minPcf: 50, maxPcf: Infinity, freightClass: 50 },
];

export function standardScaleClass(densityPcf: number): number | null {
  if (!Number.isFinite(densityPcf) || densityPcf < 0) return null;
  const row = NMFC_STANDARD_DENSITY_SCALE.find((r) => densityPcf >= r.minPcf && densityPcf < r.maxPcf);
  return row ? row.freightClass : null;
}

// ---------------------------------------------------------------------------
// Rate per mile: loaded miles vs total miles
// ---------------------------------------------------------------------------

export interface LoadRateResult {
  totalMiles: number;
  perLoadedMile: number;
  perTotalMile: number;
  /** Only when a cost per mile is supplied. */
  costTotal: number | null;
  margin: number | null;
  marginPerTotalMile: number | null;
}

export function loadRate(i: { rate: number; loadedMiles: number; emptyMiles: number; costPerMile: number | null }): LoadRateResult | null {
  if (![i.rate, i.loadedMiles, i.emptyMiles].every(Number.isFinite) || i.rate < 0 || i.loadedMiles <= 0 || i.emptyMiles < 0) return null;
  const totalMiles = i.loadedMiles + i.emptyMiles;
  const hasCost = i.costPerMile != null && Number.isFinite(i.costPerMile) && i.costPerMile >= 0;
  const costTotal = hasCost ? totalMiles * (i.costPerMile as number) : null;
  const margin = costTotal != null ? i.rate - costTotal : null;
  return {
    totalMiles,
    perLoadedMile: i.rate / i.loadedMiles,
    perTotalMile: i.rate / totalMiles,
    costTotal,
    margin,
    marginPerTotalMile: margin != null ? margin / totalMiles : null,
  };
}
