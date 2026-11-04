'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { fmt, tiedownRequirement } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function TiedownCalculator() {
  const t = useT();
  const input = useInputClass();
  const [weight, setWeight] = useState('12000');
  const [length, setLength] = useState('8');
  const [blocked, setBlocked] = useState('no');
  const [wll, setWll] = useState('1500');
  const [counting, setCounting] = useState('full');

  const r = useMemo(
    () => tiedownRequirement({
      weight: parseFloat(weight), length: parseFloat(length), blocked: blocked === 'yes',
      wll: parseFloat(wll), counting: counting === 'full' ? 'full' : 'half',
    }),
    [weight, length, blocked, wll, counting],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Tiedown calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        Pre-filled with the 12,000 lb casting example. Planning estimate for one article and one type of tiedown, using 49 CFR 393.110 and 393.106(d); commodity-specific rules in 393.116 to 393.136 can require more.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="td-weight" label="Weight of the article (lb)">
          <input id="td-weight" inputMode="decimal" className={input} value={weight} onChange={(e) => setWeight(e.target.value)} />
        </Field>
        <Field id="td-length" label="Length of the article (ft)">
          <input id="td-length" inputMode="decimal" className={input} value={length} onChange={(e) => setLength(e.target.value)} />
        </Field>
        <Field id="td-blocked" label="Blocked against forward movement?" hint="Headerboard, bulkhead, other secured cargo.">
          <select id="td-blocked" className={input} value={blocked} onChange={(e) => setBlocked(e.target.value)}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </Field>
        <Field id="td-wll" label="Working load limit of one tiedown (lb)" hint="Lowest of the strap, tensioner and anchor points.">
          <input id="td-wll" inputMode="decimal" className={input} value={wll} onChange={(e) => setWll(e.target.value)} />
        </Field>
      </div>
      <Field id="td-count" label="How the tiedown is run">
        <select id="td-count" className={input} value={counting} onChange={(e) => setCounting(e.target.value)}>
          <option value="full">Over the article to an anchor on the other side (counts 100%)</option>
          <option value="half">Vehicle anchor to article anchor, or a loop to the same side (counts 50%)</option>
        </select>
      </Field>
      <ResultBox>
        {r ? (
          <>
            <ResultRow label="Minimum number by length (393.110)" value={`${r.minByCount}`} />
            <ResultRow label="Aggregate WLL required (half the weight)" value={`${fmt(r.requiredAggregateWll, 0)} lb`} />
            <ResultRow label="Each tiedown counts for" value={`${fmt(r.countedWllEach, 0)} lb`} />
            <ResultRow label="Minimum number by strength" value={`${r.minByStrength}`} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Tiedowns needed (the larger of the two)" value={`${r.required}`} />
            <p className={`text-xs ${t.sub} mt-2`}>
              {r.governing === 'both' ? 'Both rules give the same number.' : r.governing === 'count' ? 'The length rule sets the number.' : 'The strength rule sets the number.'}
            </p>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter positive numbers in every field.</p>
        )}
      </ResultBox>
    </form>
  );
}
