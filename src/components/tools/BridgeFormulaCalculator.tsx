'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { bridgeFormula, fmt } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function BridgeFormulaCalculator() {
  const t = useT();
  const input = useInputClass();
  const [axles, setAxles] = useState('5');
  const [span, setSpan] = useState('51');
  const [actual, setActual] = useState('');

  const result = useMemo(() => bridgeFormula(parseInt(axles, 10), parseFloat(span)), [axles, span]);
  const actualNum = parseFloat(actual);
  const hasActual = Number.isFinite(actualNum) && actualNum > 0;

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Federal Bridge Formula calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        The pre-filled values are an example (five axles, 51 feet between the first and last axle). Replace them with your own.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="bf-axles" label="Number of axles in the group (N)" hint="Two or more consecutive axles.">
          <input id="bf-axles" inputMode="numeric" className={input} value={axles} onChange={(e) => setAxles(e.target.value)} />
        </Field>
        <Field id="bf-span" label="Feet between the outer axles (L)" hint="First axle of the group to the last.">
          <input id="bf-span" inputMode="decimal" className={input} value={span} onChange={(e) => setSpan(e.target.value)} />
        </Field>
      </div>

      <Field id="bf-actual" label="Actual weight on the group, lb (optional)" hint="Enter it to compare against the limit.">
        <input id="bf-actual" inputMode="decimal" className={input} value={actual} onChange={(e) => setActual(e.target.value)} />
      </Field>

      <ResultBox>
        {result ? (
          <>
            <ResultRow label="Formula result (unrounded)" value={`${fmt(result.rawWeight, 0)} lb`} />
            <ResultRow label="Rounded to the nearest 500 lb" value={`${fmt(result.formulaWeight, 0)} lb`} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Maximum weight for this group" value={`${fmt(result.limit, 0)} lb`} />
            {result.cappedAtGross && (
              <p className={`text-xs ${t.sub} mt-2`}>The formula allows more than 80,000 lb here, but the gross vehicle limit of 80,000 lb still applies.</p>
            )}
            {hasActual && (
              <p className={`text-xs ${t.sub} mt-2`}>
                {actualNum <= result.limit
                  ? `${fmt(actualNum, 0)} lb is within this group's limit of ${fmt(result.limit, 0)} lb.`
                  : `${fmt(actualNum, 0)} lb is ${fmt(actualNum - result.limit, 0)} lb over this group's limit of ${fmt(result.limit, 0)} lb.`}
              </p>
            )}
            <p className={`text-xs ${t.muted} mt-3`}>
              This checks one group of axles only. The formula must be satisfied for every group of consecutive axles, and the single-axle (20,000 lb) and tandem (34,000 lb) limits apply separately.
            </p>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter a whole number of axles (2 or more) and a positive distance to see the result.</p>
        )}
      </ResultBox>
    </form>
  );
}
