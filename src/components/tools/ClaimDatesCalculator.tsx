'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { claimDates } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function ClaimDatesCalculator() {
  const t = useT();
  const input = useInputClass();
  const [received, setReceived] = useState('2026-03-15');
  const [start, setStart] = useState('2026-01-31');
  const [disallowed, setDisallowed] = useState('');

  const r = useMemo(
    () => claimDates({ claimReceived: received, clockStart: start || undefined, disallowed: disallowed || undefined }),
    [received, start, disallowed],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Freight claim dates calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        Pre-filled with an invented example. Dates follow 49 CFR 370.5 and 370.9 and the minimum periods in 49 U.S.C. 14706(e). Your bill of lading can allow longer filing and suit periods than these minimums, so it controls. A planning aid, not legal advice.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <Field id="cl-received" label="Date the carrier received the written claim">
          <input id="cl-received" type="date" className={input} value={received} onChange={(e) => setReceived(e.target.value)} />
        </Field>
        <Field id="cl-start" label="Date the filing clock starts under the bill of lading (often delivery)" hint="Optional">
          <input id="cl-start" type="date" className={input} value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field id="cl-disallowed" label="Date of the carrier's written disallowance" hint="Optional">
          <input id="cl-disallowed" type="date" className={input} value={disallowed} onChange={(e) => setDisallowed(e.target.value)} />
        </Field>
      </div>
      <ResultBox>
        {r ? (
          <>
            <ResultRow label="Written acknowledgment due (30 days)" value={r.acknowledgmentDue} />
            <ResultRow label="Pay, decline or firm offer due (120 days)" value={r.dispositionDue} />
            <ResultRow label="Status letters if still pending" value={r.statusUpdates.join(', ')} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Filing: carrier may not set a shorter period than 9 months, so at least" value={r.minFilingDeadline ?? 'enter the start date'} />
            <ResultRow strong label="Suit: at least 2 years from the written disallowance, so at least" value={r.minSuitDeadline ?? 'enter the disallowance date'} />
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter a valid date the claim was received.</p>
        )}
      </ResultBox>
    </form>
  );
}
