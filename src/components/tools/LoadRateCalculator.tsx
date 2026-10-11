'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { fmt, loadRate } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

const money = (n: number) => `$${fmt(n)}`;

export function LoadRateCalculator() {
  const t = useT();
  const input = useInputClass();
  const [rate, setRate] = useState('1800');
  const [loaded, setLoaded] = useState('600');
  const [empty, setEmpty] = useState('120');
  const [cost, setCost] = useState('');

  const result = useMemo(
    () => loadRate({ rate: parseFloat(rate), loadedMiles: parseFloat(loaded), emptyMiles: parseFloat(empty || '0'), costPerMile: cost.trim() === '' ? null : parseFloat(cost) }),
    [rate, loaded, empty, cost],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Rate per mile calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        The values shown are made-up examples. Replace them with the load you are looking at.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Field id="lr-rate" label="Total pay ($)">
          <input id="lr-rate" inputMode="decimal" className={input} value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field id="lr-loaded" label="Loaded miles">
          <input id="lr-loaded" inputMode="decimal" className={input} value={loaded} onChange={(e) => setLoaded(e.target.value)} />
        </Field>
        <Field id="lr-empty" label="Empty miles to pickup">
          <input id="lr-empty" inputMode="decimal" className={input} value={empty} onChange={(e) => setEmpty(e.target.value)} />
        </Field>
      </div>

      <Field id="lr-cost" label="Your running cost per mile, $ (optional)" hint="Fuel, maintenance, tires, insurance and so on, divided by miles. Leave blank to skip.">
        <input id="lr-cost" inputMode="decimal" className={input} value={cost} onChange={(e) => setCost(e.target.value)} />
      </Field>

      <ResultBox>
        {result ? (
          <>
            <ResultRow label="Total miles driven" value={`${fmt(result.totalMiles, 0)} mi`} />
            <ResultRow label="Pay per loaded mile" value={money(result.perLoadedMile)} />
            <ResultRow strong label="Pay per total mile" value={money(result.perTotalMile)} />
            {result.margin != null && result.costTotal != null && result.marginPerTotalMile != null && (
              <>
                <div className="border-t border-border-light dark:border-border-dark my-2" />
                <ResultRow label="Estimated running cost" value={money(result.costTotal)} />
                <ResultRow strong label="Left after running cost" value={money(result.margin)} />
                <ResultRow label="Per total mile" value={money(result.marginPerTotalMile)} />
              </>
            )}
            <p className={`text-xs ${t.muted} mt-3`}>
              A load can look good per loaded mile and weak per total mile when the truck has to drive empty to reach it.
            </p>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter pay and loaded miles (empty miles can be 0) to see the result.</p>
        )}
      </ResultBox>
    </form>
  );
}
