'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { federalLiabilityMinimum, fmt, type InsuranceCargo } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function InsuranceRowSelector() {
  const t = useT();
  const input = useInputClass();
  const [carriage, setCarriage] = useState('for-hire');
  const [commerce, setCommerce] = useState('interstate');
  const [gvwr, setGvwr] = useState('big');
  const [cargo, setCargo] = useState('general');

  const r = useMemo(
    () => federalLiabilityMinimum({
      carriage: carriage === 'private' ? 'private' : 'for-hire',
      commerce: commerce === 'intrastate' ? 'intrastate' : 'interstate',
      gvwr10001OrMore: gvwr === 'big',
      cargo: cargo as InsuranceCargo,
    }),
    [carriage, commerce, gvwr, cargo],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Federal liability minimum selector">
      <p className={`text-xs ${t.muted} mb-4`}>
        Reads the 49 CFR 387.9 table and the applicability rules in 387.3. It shows the federal floor only, not what a shipper, broker or State requires, and it is not legal advice.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="ins-carriage" label="Type of carriage">
          <select id="ins-carriage" className={input} value={carriage} onChange={(e) => setCarriage(e.target.value)}>
            <option value="for-hire">For-hire (hauls the property of others for pay)</option>
            <option value="private">Private (hauls its own goods)</option>
          </select>
        </Field>
        <Field id="ins-commerce" label="Commerce">
          <select id="ins-commerce" className={input} value={commerce} onChange={(e) => setCommerce(e.target.value)}>
            <option value="interstate">Interstate or foreign</option>
            <option value="intrastate">Intrastate only</option>
          </select>
        </Field>
        <Field id="ins-gvwr" label="Gross vehicle weight rating">
          <select id="ins-gvwr" className={input} value={gvwr} onChange={(e) => setGvwr(e.target.value)}>
            <option value="big">10,001 lb or more</option>
            <option value="small">Under 10,001 lb</option>
          </select>
        </Field>
        <Field id="ins-cargo" label="What is hauled">
          <select id="ins-cargo" className={input} value={cargo} onChange={(e) => setCargo(e.target.value)}>
            <option value="general">Non-hazardous property</option>
            <option value="nonbulk-hazmat">Oil or hazardous materials, not in bulk</option>
            <option value="bulk-other">Oil or hazardous materials in bulk, not in the $5,000,000 list</option>
            <option value="bulk-5m">Hazardous substances in bulk tanks or hopper vehicles; bulk Division 2.1 or 2.2</option>
            <option value="highest-any">Division 1.1 to 1.3, Division 2.3 Zone A, Division 6.1 PG I Zone A, or highway route controlled Class 7</option>
          </select>
        </Field>
      </div>
      <ResultBox>
        <ResultRow strong label="Federal minimum under 387.9" value={r.amount ? `$${fmt(r.amount, 0)}` : 'None listed'} />
        {r.row && <ResultRow label="Table row" value={`Row ${r.row}`} />}
        <p className={`text-xs ${t.sub} mt-2`}>{r.note}</p>
      </ResultBox>
    </form>
  );
}
