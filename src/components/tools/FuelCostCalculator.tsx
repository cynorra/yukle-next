'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { fmt, fuelCost, type DistanceUnit, type EconomyUnit, type PriceUnit } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

const CURRENCIES = ['$', '€', '£', '₺', 'C$', 'A$'];

export function FuelCostCalculator() {
  const t = useT();
  const input = useInputClass();
  const [distance, setDistance] = useState('500');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('mi');
  const [economy, setEconomy] = useState('6.5');
  const [economyUnit, setEconomyUnit] = useState<EconomyUnit>('mpg');
  const [price, setPrice] = useState('4.00');
  const [priceUnit, setPriceUnit] = useState<PriceUnit>('gal');
  const [currency, setCurrency] = useState('$');
  const [roundTrip, setRoundTrip] = useState(false);

  const result = useMemo(
    () =>
      fuelCost({
        distance: parseFloat(distance),
        distanceUnit,
        economy: parseFloat(economy),
        economyUnit,
        price: parseFloat(price),
        priceUnit,
        roundTrip,
      }),
    [distance, distanceUnit, economy, economyUnit, price, priceUnit, roundTrip],
  );

  const volumeUnit = priceUnit === 'gal' ? 'gal' : 'L';

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Fuel cost calculator">
      <div className="grid grid-cols-[1fr_auto] gap-3 mb-3 items-end">
        <Field id="fc-distance" label="Trip distance (one way)">
          <input id="fc-distance" inputMode="decimal" className={input} value={distance} onChange={(e) => setDistance(e.target.value)} />
        </Field>
        <Field id="fc-distance-unit" label="Unit">
          <select id="fc-distance-unit" className={input} value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value as DistanceUnit)}>
            <option value="mi">miles</option>
            <option value="km">km</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-3 mb-3 items-end">
        <Field id="fc-economy" label="Fuel economy" hint="Use your own real-world figure for this truck and load, not the manufacturer's rating.">
          <input id="fc-economy" inputMode="decimal" className={input} value={economy} onChange={(e) => setEconomy(e.target.value)} />
        </Field>
        <Field id="fc-economy-unit" label="Unit">
          <select id="fc-economy-unit" className={input} value={economyUnit} onChange={(e) => setEconomyUnit(e.target.value as EconomyUnit)}>
            <option value="mpg">mpg (US)</option>
            <option value="l100km">L / 100 km</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-3 mb-3 items-end">
        <Field id="fc-price" label="Fuel price">
          <input id="fc-price" inputMode="decimal" className={input} value={price} onChange={(e) => setPrice(e.target.value)} />
        </Field>
        <Field id="fc-price-unit" label="Per">
          <select id="fc-price-unit" className={input} value={priceUnit} onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}>
            <option value="gal">US gallon</option>
            <option value="l">litre</option>
          </select>
        </Field>
        <Field id="fc-currency" label="Currency">
          <select id="fc-currency" className={input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <label className={`flex items-center gap-2 mt-1 text-xs ${t.sub}`}>
        <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} />
        Round trip (count the distance twice, e.g. for a return or empty backhaul)
      </label>

      <ResultBox>
        {result ? (
          <>
            <ResultRow label="Total distance" value={`${fmt(result.totalDistance, 0)} ${distanceUnit}`} />
            <ResultRow
              label="Fuel needed"
              value={`${fmt(priceUnit === 'gal' ? result.gallons : result.liters)} ${volumeUnit}`}
            />
            <ResultRow label={`Cost per ${distanceUnit}`} value={`${currency}${fmt(result.costPerDistanceUnit)}`} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Estimated fuel cost" value={`${currency}${fmt(result.totalCost)}`} />
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter a positive distance, fuel economy and a fuel price to see the result.</p>
        )}
      </ResultBox>
    </form>
  );
}
