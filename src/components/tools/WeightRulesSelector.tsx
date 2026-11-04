'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { fmt, weightRules } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function WeightRulesSelector() {
  const t = useT();
  const input = useInputClass();
  const [power, setPower] = useState('16000');
  const [towed, setTowed] = useState('0');
  const [actual, setActual] = useState('');
  const [commerce, setCommerce] = useState('interstate');
  const [hazmat, setHazmat] = useState('no');

  const r = useMemo(
    () => weightRules({
      powerGvwr: parseFloat(power),
      towedGvwr: parseFloat(towed || '0'),
      actualWeight: actual.trim() ? parseFloat(actual) : undefined,
      interstate: commerce === 'interstate',
      placardedHazmat: hazmat === 'yes',
    }),
    [power, towed, actual, commerce, hazmat],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Federal weight rules selector">
      <p className={`text-xs ${t.muted} mb-4`}>
        Property carriage only. Uses the weight tests in 49 CFR 390.5 and 383.5. Read each GVWR from the vehicle's certification label. A planning aid, not legal advice; State rules are not included.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="wr-power" label="GVWR of the truck or van (lb)">
          <input id="wr-power" inputMode="decimal" className={input} value={power} onChange={(e) => setPower(e.target.value)} />
        </Field>
        <Field id="wr-towed" label="GVWR of a trailer being towed (lb, 0 if none)">
          <input id="wr-towed" inputMode="decimal" className={input} value={towed} onChange={(e) => setTowed(e.target.value)} />
        </Field>
        <Field id="wr-actual" label="Actual gross weight (lb, optional)" hint="The greater of rating and actual weight counts.">
          <input id="wr-actual" inputMode="decimal" className={input} value={actual} onChange={(e) => setActual(e.target.value)} />
        </Field>
        <Field id="wr-commerce" label="Commerce">
          <select id="wr-commerce" className={input} value={commerce} onChange={(e) => setCommerce(e.target.value)}>
            <option value="interstate">Interstate (including trips that cross a State line)</option>
            <option value="intrastate">Intrastate only</option>
          </select>
        </Field>
      </div>
      <Field id="wr-hazmat" label="Carrying hazardous materials in a quantity requiring placards?">
        <select id="wr-hazmat" className={input} value={hazmat} onChange={(e) => setHazmat(e.target.value)}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </Field>
      <ResultBox>
        {r ? (
          <>
            <ResultRow label="Weight used for the 10,001 lb test" value={`${fmt(r.weightForCmv, 0)} lb`} />
            <ResultRow strong label="Federal commercial motor vehicle (390.5)" value={r.federalCmv ? 'Yes' : 'No'} />
            <ResultRow strong label="CDL group (383.5)" value={r.cdlGroup ? `Group ${r.cdlGroup}` : 'None'} />
            <ul className={`text-xs ${t.sub} mt-2 list-disc pl-5 space-y-1`}>
              {r.reasons.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter a positive GVWR for the truck or van, and zero or more for the trailer.</p>
        )}
      </ResultBox>
    </form>
  );
}
