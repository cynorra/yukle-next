'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/hooks/useT';
import { DIVISOR_PRESETS, dimensionalWeight, fmt, type UnitSystem } from '@/lib/tools/calculations';
import { Field, ResultBox, ResultRow, useInputClass } from './ToolShell';

export function DimensionalWeightCalculator() {
  const t = useT();
  const input = useInputClass();
  const [system, setSystem] = useState<UnitSystem>('imperial');
  const [presetId, setPresetId] = useState('us-139');
  const [customDivisor, setCustomDivisor] = useState('');
  const [length, setLength] = useState('24');
  const [width, setWidth] = useState('18');
  const [height, setHeight] = useState('12');
  const [quantity, setQuantity] = useState('1');
  const [actual, setActual] = useState('10');
  const [roundUp, setRoundUp] = useState(true);

  const presets = DIVISOR_PRESETS.filter((p) => p.system === system);
  const activePreset = presets.find((p) => p.id === presetId) ?? presets[0];
  const usingCustom = presetId === 'custom';
  const divisor = usingCustom ? parseFloat(customDivisor) : activePreset.divisor;
  const lenUnit = system === 'imperial' ? 'in' : 'cm';
  const wtUnit = system === 'imperial' ? 'lb' : 'kg';

  function changeSystem(next: UnitSystem) {
    setSystem(next);
    setPresetId(DIVISOR_PRESETS.find((p) => p.system === next)!.id);
  }

  const result = useMemo(
    () =>
      dimensionalWeight({
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        divisor,
        quantity: parseInt(quantity, 10),
        actualWeightPerPiece: parseFloat(actual),
        roundUp,
      }),
    [length, width, height, divisor, quantity, actual, roundUp],
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate aria-label="Dimensional weight calculator">
      <div className="flex gap-2 mb-4" role="group" aria-label="Units">
        {(['imperial', 'metric'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => changeSystem(s)}
            aria-pressed={system === s}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${system === s ? t.btnPrimary : t.btnSecondary}`}
          >
            {s === 'imperial' ? 'Inches / pounds' : 'Centimetres / kilograms'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Field id="dw-length" label={`Length (${lenUnit})`}>
          <input id="dw-length" inputMode="decimal" className={input} value={length} onChange={(e) => setLength(e.target.value)} />
        </Field>
        <Field id="dw-width" label={`Width (${lenUnit})`}>
          <input id="dw-width" inputMode="decimal" className={input} value={width} onChange={(e) => setWidth(e.target.value)} />
        </Field>
        <Field id="dw-height" label={`Height (${lenUnit})`}>
          <input id="dw-height" inputMode="decimal" className={input} value={height} onChange={(e) => setHeight(e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field id="dw-qty" label="Number of identical pieces">
          <input id="dw-qty" inputMode="numeric" className={input} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </Field>
        <Field id="dw-actual" label={`Actual weight per piece (${wtUnit})`}>
          <input id="dw-actual" inputMode="decimal" className={input} value={actual} onChange={(e) => setActual(e.target.value)} />
        </Field>
      </div>

      <Field id="dw-divisor" label="Divisor" hint="Carriers set their own divisor and change it from time to time. Confirm yours with the carrier.">
        <select id="dw-divisor" className={input} value={usingCustom ? 'custom' : activePreset.id} onChange={(e) => setPresetId(e.target.value)}>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
          <option value="custom">Custom divisor…</option>
        </select>
      </Field>

      {usingCustom && (
        <div className="mt-3">
          <Field id="dw-custom" label={`Custom divisor (${system === 'imperial' ? 'in³ per lb' : 'cm³ per kg'})`}>
            <input id="dw-custom" inputMode="decimal" className={input} value={customDivisor} onChange={(e) => setCustomDivisor(e.target.value)} />
          </Field>
        </div>
      )}

      <label className={`flex items-center gap-2 mt-4 text-xs ${t.sub}`}>
        <input type="checkbox" checked={roundUp} onChange={(e) => setRoundUp(e.target.checked)} />
        Round each dimension up to the next whole {lenUnit} (some carriers do this before calculating)
      </label>

      <ResultBox>
        {result ? (
          <>
            <ResultRow label="Volume per piece" value={`${fmt(result.volumePerPiece, 0)} ${system === 'imperial' ? 'in³' : 'cm³'}`} />
            <ResultRow label={`Dimensional weight (all pieces)`} value={`${fmt(result.totalDimWeight)} ${wtUnit}`} />
            <ResultRow label={`Actual weight (all pieces)`} value={`${fmt(result.totalActualWeight)} ${wtUnit}`} />
            <div className="border-t border-border-light dark:border-border-dark my-2" />
            <ResultRow strong label="Chargeable weight" value={`${fmt(result.chargeableWeight)} ${wtUnit}`} />
            <p className={`text-xs ${t.sub} mt-2`}>
              {result.billedOn === 'dimensional'
                ? 'Dimensional weight is higher than actual weight, so this shipment would be billed on its size.'
                : 'Actual weight is higher than dimensional weight, so this shipment would be billed on its real weight.'}
            </p>
          </>
        ) : (
          <p className={`text-sm ${t.sub}`}>Enter positive numbers for every field to see the result.</p>
        )}
      </ResultBox>
    </form>
  );
}
