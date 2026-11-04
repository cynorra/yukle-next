'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { cdlGroupFor } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function CdlGroupFinder() {
  const t = useT();
  const input = useInputClass();
  const [power, setPower] = useState('26001');
  const [towed, setTowed] = useState('0');
  const [seats, setSeats] = useState('2');
  const [actual, setActual] = useState('');
  const [hazmat, setHazmat] = useState('no');

  const r = useMemo(
    () => cdlGroupFor({
      powerGvwr: parseFloat(power),
      towedGvwr: parseFloat(towed || '0'),
      passengerSeats: parseFloat(seats || '0'),
      actualWeight: actual.trim() ? parseFloat(actual) : undefined,
      placardedHazmat: hazmat === 'yes',
    }),
    [power, towed, seats, actual, hazmat],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="CDL group finder">
      <p className={`text-xs ${t.muted} mb-4`}>
        Applies the vehicle group definitions in 49 CFR 383.5 and 383.91. Read each GVWR from the vehicle's certification label. This is a planning aid; exceptions in 383.3 and State rules are not included.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="cdl-power" label="GVWR of the truck, tractor or bus (lb)">
          <input id="cdl-power" inputMode="decimal" className={input} value={power} onChange={(e) => setPower(e.target.value)} />
        </Field>
        <Field id="cdl-towed" label="GVWR of a towed unit (lb, 0 if none)">
          <input id="cdl-towed" inputMode="decimal" className={input} value={towed} onChange={(e) => setTowed(e.target.value)} />
        </Field>
        <Field id="cdl-seats" label="Seats designed for passengers, including the driver">
          <input id="cdl-seats" inputMode="numeric" className={input} value={seats} onChange={(e) => setSeats(e.target.value)} />
        </Field>
        <Field id="cdl-actual" label="Actual gross weight (lb, optional)" hint="The greater of rating and actual weight counts.">
          <input id="cdl-actual" inputMode="decimal" className={input} value={actual} onChange={(e) => setActual(e.target.value)} />
        </Field>
      </div>
      <Field id="cdl-hazmat" label="Hauling hazardous materials that require placards?">
        <select id="cdl-hazmat" className={input} value={hazmat} onChange={(e) => setHazmat(e.target.value)}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </Field>
      <ResultBox>
        {r ? (
          <>
            <ResultRow strong label="CDL group" value={r.group ? `Group ${r.group}` : 'None'} />
            <p className={`text-xs ${t.sub} mt-2`}>{r.reason}</p>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter a positive GVWR for the power unit and non-negative numbers elsewhere.</p>
        )}
      </ResultBox>
    </form>
  );
}
