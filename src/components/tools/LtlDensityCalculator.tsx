'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { fmt, ltlDensity } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function LtlDensityCalculator() {
  const t = useT();
  const input = useInputClass();
  const [length, setLength] = useState('48');
  const [width, setWidth] = useState('40');
  const [height, setHeight] = useState('45');
  const [weight, setWeight] = useState('450');
  const [units, setUnits] = useState('1');

  const result = useMemo(
    () => ltlDensity({ length: parseFloat(length), width: parseFloat(width), height: parseFloat(height), weight: parseFloat(weight), units: parseInt(units, 10) }),
    [length, width, height, weight, units],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="LTL density calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        The pre-filled values are the example NMFTA publishes (a 48 × 40 × 45 inch pallet weighing 450 lb). Replace them with your own handling unit.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Field id="ld-length" label="Length (in)">
          <input id="ld-length" inputMode="decimal" className={input} value={length} onChange={(e) => setLength(e.target.value)} />
        </Field>
        <Field id="ld-width" label="Width (in)">
          <input id="ld-width" inputMode="decimal" className={input} value={width} onChange={(e) => setWidth(e.target.value)} />
        </Field>
        <Field id="ld-height" label="Height (in)">
          <input id="ld-height" inputMode="decimal" className={input} value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field id="ld-weight" label="Weight of one handling unit (lb)" hint="As tendered, including the pallet.">
          <input id="ld-weight" inputMode="decimal" className={input} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
        <Field id="ld-units" label="Number of identical units">
          <input id="ld-units" inputMode="numeric" className={input} value={units} onChange={(e) => setUnits(e.target.value)} />
        </Field>
      </div>

      <ResultBox>
        {result ? (
          <>
            <ResultRow label="Volume of one unit" value={`${fmt(result.cubicInches, 0)} in³`} />
            <ResultRow label="Cubic feet of one unit" value={`${fmt(result.cubicFeet)} ft³`} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Density" value={`${fmt(result.densityPcf)} lb per ft³`} />
            <ResultRow label="Total weight, all units" value={`${fmt(result.totalWeight, 0)} lb`} />
            <ResultRow label="Total cube, all units" value={`${fmt(result.totalCubicFeet)} ft³`} />
            <p className={`text-xs ${t.muted} mt-3`}>
              This gives the density only. The freight class depends on the commodity&apos;s NMFC item number and the current NMFTA tables, which you can look up in NMFTA&apos;s ClassIT+.
            </p>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter positive numbers for every field to see the result.</p>
        )}
      </ResultBox>
    </form>
  );
}
