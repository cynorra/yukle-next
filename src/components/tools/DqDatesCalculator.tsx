'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { dqDates } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function DqDatesCalculator() {
  const t = useT();
  const input = useInputClass();
  const [hired, setHired] = useState('2025-03-01');
  const [lastAnnual, setLastAnnual] = useState('');
  const [separated, setSeparated] = useState('2027-01-15');
  const [recordDate, setRecordDate] = useState('2026-03-01');

  const r = useMemo(
    () => dqDates({
      hired,
      lastAnnual: lastAnnual || undefined,
      separated: separated || undefined,
      annualRecordDate: recordDate || undefined,
    }),
    [hired, lastAnnual, separated, recordDate],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Driver qualification file dates calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        Pre-filled with an invented driver. Dates follow 49 CFR 391.23, 391.25, 391.51 and 391.53. The rule says "at least once every 12 months" without naming a start date, so the annual date counts 12 months from the last inquiry, or from the hire-date inquiry for the first one. A planning aid, not legal advice.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <Field id="dq-hired" label="Date employment began">
          <input id="dq-hired" type="date" className={input} value={hired} onChange={(e) => setHired(e.target.value)} />
        </Field>
        <Field id="dq-annual" label="Date of the last annual inquiry" hint="Optional">
          <input id="dq-annual" type="date" className={input} value={lastAnnual} onChange={(e) => setLastAnnual(e.target.value)} />
        </Field>
        <Field id="dq-separated" label="Date employment ended" hint="Optional">
          <input id="dq-separated" type="date" className={input} value={separated} onChange={(e) => setSeparated(e.target.value)} />
        </Field>
        <Field id="dq-record" label="Date of an annual record, review note or medical certificate" hint="Optional">
          <input id="dq-record" type="date" className={input} value={recordDate} onChange={(e) => setRecordDate(e.target.value)} />
        </Field>
      </div>
      <ResultBox>
        {r ? (
          <>
            <ResultRow label="Hire-date motor vehicle record and previous-employer records due in the files" value={r.hireItemsDue} />
            <ResultRow label="Next annual inquiry and review due by" value={r.nextAnnualDue ?? 'n/a'} />
            <ResultRow strong label="Keep the whole file until" value={r.keepFileUntil ?? 'enter the end date'} />
            <ResultRow label="That annual record may be removed from" value={r.annualRecordRemovableFrom ?? 'enter the record date'} />
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter a valid hire date.</p>
        )}
      </ResultBox>
    </form>
  );
}
