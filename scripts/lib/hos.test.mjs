// node scripts/lib/hos.test.mjs — HOS clock arithmetic per 49 CFR 395.3 and the article's worked examples.
import assert from 'node:assert/strict';
import { hosClocks } from '../../src/lib/tools/calculations.ts';
const m = (h, mm = 0) => h * 60 + mm;

// Article example 1: on duty 06:00, 8 h driven by 14:00 with no break yet -> break is the binding limit (0 h left)
let r = hosClocks({ onDutyStartMin: m(6), nowMin: m(14), drivingHours: 8, drivingSinceBreakHours: 8, cycleUsedHours: 8, cycleLimitHours: 70 });
assert.equal(r.bindingLimit, 'break'); assert.equal(r.maxDrivableHours, 0); assert.equal(r.drivingLeftHours, 3); assert.equal(r.windowEndMin, m(20));
// after a 30-minute break at 14:30: 3 h of driving left, window to 20:00 (5.5 h left), so driving limit binds -> stop at 17:30
r = hosClocks({ onDutyStartMin: m(6), nowMin: m(14, 30), drivingHours: 8, drivingSinceBreakHours: 0, cycleUsedHours: 8.5, cycleLimitHours: 70 });
assert.equal(r.bindingLimit, 'driving'); assert.equal(r.maxDrivableHours, 3); assert.equal(r.windowLeftHours, 5.5);
// Article example 2: on duty 05:00, 3 h at the dock, driving starts 08:00 -> window ends 19:00; 8 h cap and 11 h cap not binding yet
r = hosClocks({ onDutyStartMin: m(5), nowMin: m(8), drivingHours: 0, drivingSinceBreakHours: 0, cycleUsedHours: 3, cycleLimitHours: 70 });
assert.equal(r.windowEndMin, m(19)); assert.equal(r.windowLeftHours, 11); assert.equal(r.bindingLimit, 'break'); assert.equal(r.maxDrivableHours, 8);
// 08:00 + 8 h driving = 16:00, 30-min break -> 16:30; window left 2.5 h, driving left 3 h -> window binds at 2.5 h (stop 19:00): 10.5 h driven in total
r = hosClocks({ onDutyStartMin: m(5), nowMin: m(16, 30), drivingHours: 8, drivingSinceBreakHours: 0, cycleUsedHours: 11.5, cycleLimitHours: 70 });
assert.equal(r.bindingLimit, 'window'); assert.equal(r.maxDrivableHours, 2.5); assert.equal(8 + r.maxDrivableHours, 10.5);
// Cycle binding: 63 of 70 hours used, fresh shift
r = hosClocks({ onDutyStartMin: m(6), nowMin: m(6), drivingHours: 0, drivingSinceBreakHours: 0, cycleUsedHours: 63, cycleLimitHours: 70 });
assert.equal(r.bindingLimit, 'cycle'); assert.equal(r.maxDrivableHours, 7);
// invalid input
assert.equal(hosClocks({ onDutyStartMin: m(6), nowMin: m(5), drivingHours: 0, drivingSinceBreakHours: 0, cycleUsedHours: 0, cycleLimitHours: 70 }), null);
assert.equal(hosClocks({ onDutyStartMin: m(6), nowMin: m(7), drivingHours: 0, drivingSinceBreakHours: 0, cycleUsedHours: 0, cycleLimitHours: 65 }), null);

// 8-day cycle example from the article: on-duty hours by day, rolling 8 days, 70-hour limit
const days = [11, 12, 12, 10, 12, 8, 5, 0];
const sum = (a) => a.reduce((x, y) => x + y, 0);
assert.equal(sum(days.slice(0, 6)), 65); assert.equal(sum(days.slice(0, 7)), 70);
// day 9: day 1 (11 h) leaves the window -> days 2-8 hold 59 h with day 8 at 0 -> 11 h more would be allowed
assert.equal(sum(days.slice(1, 8)), 59); assert.equal(70 - sum(days.slice(1, 8)), 11);
console.log('hos tests passed');
