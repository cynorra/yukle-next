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
  /** True when the formula value falls exactly halfway between two 500 lb steps (FHWA's table rounds those down). */
  halfwayRoundedDown: boolean;
}

/** W = 500 x [ (L x N / (N - 1)) + 12N + 36 ]; N axles in the group, L feet between the outer axles. */
export function bridgeFormula(axles: number, spanFeet: number): BridgeFormulaResult | null {
  if (!Number.isFinite(axles) || !Number.isFinite(spanFeet)) return null;
  if (!Number.isInteger(axles) || axles < 2 || spanFeet <= 0) return null;
  const rawWeight = 500 * ((spanFeet * axles) / (axles - 1) + 12 * axles + 36);
  // Nearest 500 lb, rounding DOWN when exactly halfway: FHWA's Bridge Table (FHWA-HOP-19-028, footnote 1) states this policy.
  const formulaWeight = Math.ceil(rawWeight / 500 - 0.5 - 1e-9) * 500;
  const limit = Math.min(formulaWeight, 80000);
  const halfwayRoundedDown = Math.abs(rawWeight / 500 - Math.floor(rawWeight / 500) - 0.5) < 1e-9;
  return { rawWeight, formulaWeight, limit, cappedAtGross: formulaWeight > 80000, halfwayRoundedDown };
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
// Cargo tiedowns: minimum number (49 CFR 393.110) and aggregate working load limit (393.106(d))
// ---------------------------------------------------------------------------

export interface TiedownInput {
  /** Weight of the article or group of articles, lb. */
  weight: number;
  /** Length of the article, ft. */
  length: number;
  /** Blocked against forward movement by a headerboard, bulkhead, other secured cargo or similar. */
  blocked: boolean;
  /** Working load limit of one tiedown, lb: the lowest of its components and anchor points (393.108(a)). */
  wll: number;
  /**
   * 'full': goes over the article to an anchor on the other side of the vehicle (counts 100% of its WLL).
   * 'half': vehicle anchor to an anchor on the article, or a loop back to the same side (counts 50%).
   */
  counting: 'full' | 'half';
}

export interface TiedownResult {
  minByCount: number;
  requiredAggregateWll: number;
  countedWllEach: number;
  minByStrength: number;
  required: number;
  governing: 'count' | 'strength' | 'both';
}

export function minTiedownsByCount(weight: number, length: number, blocked: boolean): number {
  if (blocked) return Math.max(1, Math.ceil(length / 10 - 1e-9));
  if (length <= 5) return weight <= 1100 ? 1 : 2;
  if (length <= 10) return 2;
  return 2 + Math.ceil((length - 10) / 10 - 1e-9);
}

export function tiedownRequirement(i: TiedownInput): TiedownResult | null {
  if (![i.weight, i.length, i.wll].every((v) => Number.isFinite(v) && v > 0)) return null;
  const minByCount = minTiedownsByCount(i.weight, i.length, i.blocked);
  const requiredAggregateWll = i.weight / 2;
  const countedWllEach = i.counting === 'full' ? i.wll : i.wll / 2;
  const minByStrength = Math.ceil(requiredAggregateWll / countedWllEach - 1e-9);
  const required = Math.max(minByCount, minByStrength);
  const governing = minByCount === minByStrength ? 'both' : minByCount > minByStrength ? 'count' : 'strength';
  return { minByCount, requiredAggregateWll, countedWllEach, minByStrength, required, governing };
}

// ---------------------------------------------------------------------------
// Federal minimum public liability (49 CFR 387.3 applicability and the 387.9 table)
// ---------------------------------------------------------------------------

export type InsuranceCargo =
  | 'general'          // non-hazardous property
  | 'nonbulk-hazmat'   // oil (172.101) or hazardous waste/materials/substances, not in bulk, not in the highest category
  | 'bulk-other'       // oil or hazardous materials in bulk (over 3,500 water gallons) not in the $5,000,000 list
  | 'bulk-5m'          // hazardous substances in bulk in cargo tanks, portable tanks or hopper-type vehicles; bulk Div. 2.1 or 2.2
  | 'highest-any';     // Div. 1.1-1.3, Div. 2.3 Zone A, Div. 6.1 PG I Zone A, or highway route controlled quantity of Class 7

export interface InsuranceInput {
  carriage: 'for-hire' | 'private';
  commerce: 'interstate' | 'intrastate';
  gvwr10001OrMore: boolean;
  cargo: InsuranceCargo;
}

export interface InsuranceResult {
  /** Dollar minimum, or null when 387.9 sets none for this combination. */
  amount: number | null;
  /** Row number in the 387.9 table (1 to 4), or null. */
  row: 1 | 2 | 3 | 4 | null;
  note: string;
}

export function federalLiabilityMinimum(i: InsuranceInput): InsuranceResult {
  const none = (note: string): InsuranceResult => ({ amount: null, row: null, note });
  switch (i.cargo) {
    case 'general':
      if (i.carriage === 'for-hire' && i.commerce === 'interstate' && i.gvwr10001OrMore) {
        return { amount: 750000, row: 1, note: 'Row 1: for-hire, interstate or foreign commerce, GVWR 10,001 lb or more, non-hazardous property.' };
      }
      return none('387.9 sets no minimum for this combination (it covers for-hire carriers of non-hazardous property in interstate or foreign commerce with GVWR of 10,001 lb or more). State or contract requirements may still apply.');
    case 'highest-any':
      if (i.gvwr10001OrMore) return { amount: 5000000, row: 2, note: 'Row 2: GVWR 10,001 lb or more, for-hire or private, interstate, foreign or intrastate.' };
      if (i.commerce === 'interstate') return { amount: 5000000, row: 4, note: 'Row 4: GVWR under 10,001 lb, interstate or foreign commerce, these materials in any quantity.' };
      return none('Intrastate and under 10,001 lb GVWR: 387.3(c)(1) excepts vehicles under 10,001 lb, and its exceptions to the exception are written for interstate or foreign commerce. Confirm with FMCSA.');
    case 'bulk-5m':
      if (i.gvwr10001OrMore) return { amount: 5000000, row: 2, note: 'Row 2: GVWR 10,001 lb or more, for-hire or private, any commerce.' };
      return none('Under 10,001 lb GVWR, 387.9 lists only the Row 4 materials; this category is not among them.');
    case 'bulk-other':
      if (i.gvwr10001OrMore) return { amount: 1000000, row: 3, note: 'Row 3: GVWR 10,001 lb or more, oil or hazardous materials in bulk (interstate, foreign or intrastate).' };
      return none('Under 10,001 lb GVWR, 387.3(c)(1) excepts the vehicle for this category.');
    case 'nonbulk-hazmat':
      if (i.gvwr10001OrMore && i.commerce === 'interstate') return { amount: 1000000, row: 3, note: 'Row 3: GVWR 10,001 lb or more, in any quantity in interstate or foreign commerce.' };
      return none('387.3(c)(2) excepts non-bulk oil and hazardous materials in intrastate commerce, and 387.3(c)(1) excepts vehicles under 10,001 lb.');
  }
}

// ---------------------------------------------------------------------------
// Which federal weight rules apply: CMV (49 CFR 390.5) and CDL group (383.5)
// ---------------------------------------------------------------------------

export interface WeightRulesInput {
  /** GVWR of the power unit (single vehicle), lb. */
  powerGvwr: number;
  /** GVWR of a towed unit, lb; 0 when not towing. */
  towedGvwr: number;
  /** Actual gross weight of the vehicle or combination, lb, if known; the greater of rating and actual weight is used. */
  actualWeight?: number;
  interstate: boolean;
  /** Carries hazardous materials in a quantity requiring placards. */
  placardedHazmat: boolean;
}

export interface WeightRulesResult {
  /** Weight used for the 10,001 lb test (combined when towing). */
  weightForCmv: number;
  /** Is it a commercial motor vehicle under 390.5 (property carriage)? Requires interstate commerce. */
  federalCmv: boolean;
  /** CDL group under 383.5, which applies in interstate and intrastate commerce. */
  cdlGroup: 'A' | 'B' | 'C' | null;
  reasons: string[];
}

export function weightRules(i: WeightRulesInput): WeightRulesResult | null {
  if (!Number.isFinite(i.powerGvwr) || i.powerGvwr <= 0 || !Number.isFinite(i.towedGvwr) || i.towedGvwr < 0) return null;
  const actual = i.actualWeight && Number.isFinite(i.actualWeight) && i.actualWeight > 0 ? i.actualWeight : 0;
  const towing = i.towedGvwr > 0;
  const ratedCombined = i.powerGvwr + i.towedGvwr;
  const weightForCmv = Math.max(towing ? ratedCombined : i.powerGvwr, actual);
  const reasons: string[] = [];

  const byWeight = weightForCmv >= 10001;
  const federalCmv = i.interstate && (byWeight || i.placardedHazmat);
  if (!i.interstate) reasons.push('Intrastate only: the 390.5 definition of a commercial motor vehicle requires interstate commerce, so the federal safety rules do not apply on this basis. State rules may.');
  else if (byWeight) reasons.push(`Interstate and ${weightForCmv.toLocaleString('en-US')} lb is 10,001 lb or more.`);
  else if (i.placardedHazmat) reasons.push('Interstate and carrying placarded hazardous materials, which makes it a commercial motor vehicle at any weight.');
  else reasons.push(`${weightForCmv.toLocaleString('en-US')} lb is under 10,001 lb and no placarded hazmat, so it is not a commercial motor vehicle.`);

  let cdlGroup: 'A' | 'B' | 'C' | null = null;
  const combined = Math.max(ratedCombined, actual);
  if (towing && combined >= 26001 && i.towedGvwr > 10000) cdlGroup = 'A';
  else if (Math.max(i.powerGvwr, towing ? 0 : actual) >= 26001) cdlGroup = 'B';
  else if (i.placardedHazmat) cdlGroup = 'C';
  if (cdlGroup === 'A') reasons.push('CDL Group A: combination of 26,001 lb or more with a towed unit over 10,000 lb.');
  if (cdlGroup === 'B') reasons.push('CDL Group B: a single vehicle of 26,001 lb or more.');
  if (cdlGroup === 'C') reasons.push('CDL Group C: smaller vehicle used to carry placarded hazardous materials.');
  if (!cdlGroup) reasons.push('No CDL is triggered by weight or hazmat here (383.5).');
  return { weightForCmv, federalCmv, cdlGroup, reasons };
}

// ---------------------------------------------------------------------------
// Freight claim dates (49 CFR 370.5, 370.9; 49 U.S.C. 14706(e))
// ---------------------------------------------------------------------------

function parseIsoDate(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? d : null;
}
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
export function addDaysIso(v: string, days: number): string | null {
  const d = parseIsoDate(v);
  if (!d) return null;
  d.setUTCDate(d.getUTCDate() + days);
  return isoDate(d);
}
/** Calendar-month addition; a day that does not exist in the target month moves to that month's last day. */
export function addMonthsIso(v: string, months: number): string | null {
  const d = parseIsoDate(v);
  if (!d) return null;
  const day = d.getUTCDate();
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  t.setUTCDate(Math.min(day, last));
  return isoDate(t);
}

export interface ClaimDates {
  acknowledgmentDue: string;
  dispositionDue: string;
  /** First status letter if still pending is due at day 120, then every 60 days. */
  statusUpdates: string[];
  /** Earliest the carrier may set the last day to file, counted from the date the clock starts under the bill of lading. */
  minFilingDeadline: string | null;
  /** Earliest the carrier may set the last day to sue, counted from written disallowance. */
  minSuitDeadline: string | null;
}

export function claimDates(i: { claimReceived: string; clockStart?: string; disallowed?: string }): ClaimDates | null {
  const ack = addDaysIso(i.claimReceived, 30);
  const disp = addDaysIso(i.claimReceived, 120);
  if (!ack || !disp) return null;
  const statusUpdates = [120, 180, 240].map((n) => addDaysIso(i.claimReceived, n)!);
  return {
    acknowledgmentDue: ack,
    dispositionDue: disp,
    statusUpdates,
    minFilingDeadline: i.clockStart ? addMonthsIso(i.clockStart, 9) : null,
    minSuitDeadline: i.disallowed ? addMonthsIso(i.disallowed, 24) : null,
  };
}

// ---------------------------------------------------------------------------
// CDL vehicle group finder (49 CFR 383.5 and 383.91)
// ---------------------------------------------------------------------------

export interface CdlGroupInput {
  powerGvwr: number;
  towedGvwr: number;
  actualWeight?: number;
  /** Seats the vehicle is designed to carry, including the driver. */
  passengerSeats: number;
  placardedHazmat: boolean;
}

export function cdlGroupFor(i: CdlGroupInput): { group: 'A' | 'B' | 'C' | null; reason: string } | null {
  if (!Number.isFinite(i.powerGvwr) || i.powerGvwr <= 0 || !Number.isFinite(i.towedGvwr) || i.towedGvwr < 0 || !Number.isFinite(i.passengerSeats) || i.passengerSeats < 0) return null;
  const towing = i.towedGvwr > 0;
  const actual = i.actualWeight && i.actualWeight > 0 ? i.actualWeight : 0;
  const combined = Math.max(i.powerGvwr + i.towedGvwr, actual);
  if (towing && combined >= 26001 && i.towedGvwr > 10000) return { group: 'A', reason: 'Group A: combination of 26,001 lb or more, and the towed unit is rated over 10,000 lb (383.91(a)(1)).' };
  if (Math.max(i.powerGvwr, towing ? 0 : actual) >= 26001) return { group: 'B', reason: 'Group B: a single vehicle of 26,001 lb or more, including one towing a unit of 10,000 lb or less (383.91(a)(2)).' };
  if (i.passengerSeats >= 16) return { group: 'C', reason: 'Group C: designed to carry 16 or more passengers including the driver (383.91(a)(3)).' };
  if (i.placardedHazmat) return { group: 'C', reason: 'Group C: of any size, used to transport hazardous materials that require placards (383.91(a)(3), 383.5).' };
  return { group: null, reason: 'No CDL group by weight, passenger capacity or placarded hazmat.' };
}

// ---------------------------------------------------------------------------
// Driver qualification file dates (49 CFR 391.23, 391.25, 391.51, 391.53; 382.701)
// ---------------------------------------------------------------------------

export interface DqDates {
  /** Hire date + 30 days: motor vehicle record inquiry result and previous-employer investigation records are due in the files (391.23(b), (c)). */
  hireItemsDue: string;
  /** No later than 12 months after the last annual inquiry (or after the hire-date inquiry for the first one): 391.25(a), (b). */
  nextAnnualDue: string | null;
  /** Keep the file until this date: separation date + 3 years (391.51(c); investigation history 391.53(c)). */
  keepFileUntil: string | null;
  /** Annual MVR, review note and medical certificate records execution date + 3 years: may be removed from the file (391.51(d)). */
  annualRecordRemovableFrom: string | null;
}

export function dqDates(i: { hired: string; lastAnnual?: string; separated?: string; annualRecordDate?: string }): DqDates | null {
  const due = addDaysIso(i.hired, 30);
  if (!due) return null;
  const base = i.lastAnnual || i.hired;
  return {
    hireItemsDue: due,
    nextAnnualDue: addMonthsIso(base, 12),
    keepFileUntil: i.separated ? addMonthsIso(i.separated, 36) : null,
    annualRecordRemovableFrom: i.annualRecordDate ? addMonthsIso(i.annualRecordDate, 36) : null,
  };
}

// ---------------------------------------------------------------------------
// Factoring: what an invoice actually nets (arithmetic only; the contract sets every term)
// ---------------------------------------------------------------------------

export interface FactoringResult {
  advance: number;
  fee: number;
  reserveReleased: number;
  totalReceived: number;
  /** invoice minus total received */
  totalCost: number;
  feeAsPercentOfAdvance: number;
  /** fee divided by the number of days the cash arrives early, if given */
  costPerDayEarly: number | null;
}

export function factoringNet(i: { invoice: number; advancePct: number; feePct: number; daysEarly?: number }): FactoringResult | null {
  if (![i.invoice, i.advancePct, i.feePct].every(Number.isFinite) || i.invoice <= 0 || i.advancePct <= 0 || i.advancePct > 100 || i.feePct < 0) return null;
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const advance = round2((i.invoice * i.advancePct) / 100);
  const fee = round2((i.invoice * i.feePct) / 100);
  const reserveReleased = round2(i.invoice - advance - fee);
  if (reserveReleased < 0) return null; // advance plus fee exceed the invoice: not a valid example
  const totalReceived = round2(advance + reserveReleased);
  return {
    advance,
    fee,
    reserveReleased,
    totalReceived,
    totalCost: round2(i.invoice - totalReceived),
    feeAsPercentOfAdvance: round2((fee / advance) * 100),
    costPerDayEarly: i.daysEarly && i.daysEarly > 0 ? round2(fee / i.daysEarly) : null,
  };
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
