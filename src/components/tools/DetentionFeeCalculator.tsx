'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { detentionFee, fmt, fmtMinutes } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

const CURRENCIES = ['$', '€', '£', '₺', 'C$', 'A$'];

export function DetentionFeeCalculator() {
  const t = useT();
  const input = useInputClass();
  const [hours, setHours] = useState('4');
  const [minutes, setMinutes] = useState('20');
  const [freeHours, setFreeHours] = useState('2');
  const [rate, setRate] = useState('50');
  const [increment, setIncrement] = useState('15');
  const [cap, setCap] = useState('');
  const [currency, setCurrency] = useState('$');

  const result = useMemo(
    () =>
      detentionFee({
        hoursOnSite: parseFloat(hours || '0'),
        minutesOnSite: parseFloat(minutes || '0'),
        freeHours: parseFloat(freeHours || '0'),
        ratePerHour: parseFloat(rate),
        incrementMinutes: parseInt(increment, 10),
        cap: parseFloat(cap),
      }),
    [hours, minutes, freeHours, rate, increment, cap],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Detention fee calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        The values shown are examples only. Replace them with the terms in your rate confirmation or contract.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="df-hours" label="Time on site: hours">
          <input id="df-hours" inputMode="numeric" className={input} value={hours} onChange={(e) => setHours(e.target.value)} />
        </Field>
        <Field id="df-minutes" label="Time on site: minutes">
          <input id="df-minutes" inputMode="numeric" className={input} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="df-free" label="Free time (hours)" hint="Time allowed before detention starts.">
          <input id="df-free" inputMode="decimal" className={input} value={freeHours} onChange={(e) => setFreeHours(e.target.value)} />
        </Field>
        <Field id="df-increment" label="Billing increment">
          <select id="df-increment" className={input} value={increment} onChange={(e) => setIncrement(e.target.value)}>
            <option value="1">Per minute</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 mb-3 items-end">
        <Field id="df-rate" label="Detention rate per hour">
          <input id="df-rate" inputMode="decimal" className={input} value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field id="df-cap" label="Maximum charge (optional)">
          <input id="df-cap" inputMode="decimal" className={input} value={cap} placeholder="No cap" onChange={(e) => setCap(e.target.value)} />
        </Field>
        <Field id="df-currency" label="Currency">
          <select id="df-currency" className={input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <ResultBox>
        {result ? (
          <>
            <ResultRow label="Total time on site" value={fmtMinutes(result.minutesOnSite)} />
            <ResultRow label="Free time" value={fmtMinutes(result.freeMinutes)} />
            <ResultRow label="Time beyond free time" value={fmtMinutes(result.minutesOverFree)} />
            <ResultRow label="Billable time (rounded up to the increment)" value={fmtMinutes(result.billableMinutes)} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Detention charge" value={`${currency}${fmt(result.fee)}`} />
            {result.capApplied && <p className={`text-xs ${t.sub} mt-2`}>The maximum charge you entered was applied.</p>}
            {result.minutesOverFree === 0 && (
              <p className={`text-xs ${t.sub} mt-2`}>The time on site is within the free time, so no detention is due.</p>
            )}
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter zero or positive numbers, and a billing increment, to see the result.</p>
        )}
      </ResultBox>
    </form>
  );
}
