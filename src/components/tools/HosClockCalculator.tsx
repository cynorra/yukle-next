'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { fmt, hosClocks } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

function toMin(v: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(v);
  return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : NaN;
}
function clock(min: number): string {
  const day = Math.floor(min / 1440);
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}${day > 0 ? ' (next day)' : ''}`;
}

const LABEL: Record<string, string> = {
  driving: 'the 11-hour driving limit',
  window: 'the end of the 14-hour period',
  break: 'the need for a 30-minute interruption (8 hours of driving without one)',
  cycle: 'the 60/70-hour limit',
};

export function HosClockCalculator() {
  const t = useT();
  const input = useInputClass();
  const [start, setStart] = useState('06:00');
  const [now, setNow] = useState('14:00');
  const [driving, setDriving] = useState('8');
  const [sinceBreak, setSinceBreak] = useState('8');
  const [cycleUsed, setCycleUsed] = useState('8');
  const [cycle, setCycle] = useState('70');

  const r = useMemo(
    () => hosClocks({
      onDutyStartMin: toMin(start), nowMin: toMin(now),
      drivingHours: parseFloat(driving), drivingSinceBreakHours: parseFloat(sinceBreak),
      cycleUsedHours: parseFloat(cycleUsed), cycleLimitHours: parseInt(cycle, 10),
    }),
    [start, now, driving, sinceBreak, cycleUsed, cycle],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Hours of service clock calculator">
      <p className={`text-xs ${t.muted} mb-4`}>
        Pre-filled with the worked example below: on duty at 06:00 and 8 hours driven by 14:00. Replace the values with your shift. This is a planning estimate for a single shift after 10 consecutive hours off duty; it does not model sleeper-berth splits or the short-haul exceptions, and your ELD is the record that counts.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="hos-start" label="Came on duty at (24-hour time)">
          <input id="hos-start" type="time" className={input} value={start} onChange={(e) => setStart(e.target.value)} />
        </Field>
        <Field id="hos-now" label="Current time (same day)">
          <input id="hos-now" type="time" className={input} value={now} onChange={(e) => setNow(e.target.value)} />
        </Field>
        <Field id="hos-driving" label="Hours driven this shift">
          <input id="hos-driving" inputMode="decimal" className={input} value={driving} onChange={(e) => setDriving(e.target.value)} />
        </Field>
        <Field id="hos-since" label="Hours driven since the last 30-minute interruption">
          <input id="hos-since" inputMode="decimal" className={input} value={sinceBreak} onChange={(e) => setSinceBreak(e.target.value)} />
        </Field>
        <Field id="hos-cycle-used" label="Hours on duty in the current 7 or 8 days (including today)">
          <input id="hos-cycle-used" inputMode="decimal" className={input} value={cycleUsed} onChange={(e) => setCycleUsed(e.target.value)} />
        </Field>
        <Field id="hos-cycle" label="Weekly limit">
          <select id="hos-cycle" className={input} value={cycle} onChange={(e) => setCycle(e.target.value)}>
            <option value="70">70 hours in 8 days</option>
            <option value="60">60 hours in 7 days</option>
          </select>
        </Field>
      </div>
      <ResultBox>
        {r ? (
          <>
            <ResultRow label="Driving time left (11-hour limit)" value={`${fmt(r.drivingLeftHours)} h`} />
            <ResultRow label="14-hour period ends at" value={clock(r.windowEndMin)} />
            <ResultRow label="Hours until a 30-minute break is needed" value={`${fmt(r.hoursUntilBreakNeeded)} h`} />
            <ResultRow label="Weekly hours left" value={`${fmt(r.cycleLeftHours)} h`} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Driving still possible before the first limit" value={`${fmt(r.maxDrivableHours)} h`} />
            <p className={`text-xs ${t.sub} mt-2`}>First limit reached: {LABEL[r.bindingLimit]}.</p>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter times as hours and minutes, the current time at or after the start time, and non-negative hours.</p>
        )}
      </ResultBox>
    </form>
  );
}
