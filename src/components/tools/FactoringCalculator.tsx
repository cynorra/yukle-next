'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { factoringNet } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function FactoringCalculator() {
  const t = useT();
  const input = useInputClass();
  const [invoice, setInvoice] = useState('2000');
  const [advance, setAdvance] = useState('90');
  const [fee, setFee] = useState('3');
  const [days, setDays] = useState('30');

  const r = useMemo(
    () => factoringNet({ invoice: parseFloat(invoice), advancePct: parseFloat(advance), feePct: parseFloat(fee), daysEarly: days.trim() ? parseFloat(days) : undefined }),
    [invoice, advance, fee, days],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Factoring cost calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        The pre-filled numbers are invented. Real contracts differ: some charge by the day, add fees for payment methods or late customer payment, or hold different reserves. Enter the terms from your own contract.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="fc-invoice" label="Invoice amount ($)">
          <input id="fc-invoice" inputMode="decimal" className={input} value={invoice} onChange={(e) => setInvoice(e.target.value)} />
        </Field>
        <Field id="fc-advance" label="Advance rate (% of invoice)">
          <input id="fc-advance" inputMode="decimal" className={input} value={advance} onChange={(e) => setAdvance(e.target.value)} />
        </Field>
        <Field id="fc-fee" label="Fee (% of invoice)">
          <input id="fc-fee" inputMode="decimal" className={input} value={fee} onChange={(e) => setFee(e.target.value)} />
        </Field>
        <Field id="fc-days" label="Days earlier than the customer would pay" hint="Optional">
          <input id="fc-days" inputMode="numeric" className={input} value={days} onChange={(e) => setDays(e.target.value)} />
        </Field>
      </div>
      <ResultBox>
        {r ? (
          <>
            <ResultRow label="Advance paid up front" value={money(r.advance)} />
            <ResultRow label="Fee" value={money(r.fee)} />
            <ResultRow label="Reserve released after the customer pays" value={money(r.reserveReleased)} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Total received" value={money(r.totalReceived)} />
            <ResultRow label="Total cost" value={money(r.totalCost)} />
            <ResultRow label="Fee as a share of the advance" value={`${r.feeAsPercentOfAdvance}%`} />
            {r.costPerDayEarly !== null && <ResultRow label="Fee per day of acceleration" value={money(r.costPerDayEarly)} />}
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter a positive invoice, an advance rate up to 100 percent, and a fee that leaves the advance and fee within the invoice.</p>
        )}
      </ResultBox>
    </form>
  );
}
