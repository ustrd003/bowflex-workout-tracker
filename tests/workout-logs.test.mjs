import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

async function moduleUrl(path, replacements = []) {
  let source = await readFile(new URL(path, import.meta.url), 'utf8');
  for (const [from, to] of replacements) source = source.replace(from, to);
  const compiled = ts.transpile(source, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 });
  return `data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`;
}
const dataUrl = await moduleUrl('../app/workout-data.ts');
const { buildLogs } = await import(await moduleUrl('../app/workout-logs.ts', [['"./workout-data"', JSON.stringify(dataUrl)]]));
const entry = (setNumber, tooEasy) => ({ week: 1, day: 'Monday', exerciseId: 'bench-press', setNumber, resistance: 25, reps: 12, tooEasy, completedAt: '2026-09-21T12:00:00Z' });

test('last set difficulty carries only to the next workout first set', () => {
  const sets = buildLogs(8, 'Thursday', [entry(2, true), entry(1, false)])['bench-press'];
  assert.deepEqual(sets[0], { resistance: '25', reps: '12', tooEasy: true });
  assert.ok(sets.slice(1).every(set => set.tooEasy === false));
});
test('unchecked last set clears the reminder and saved sets retain their own ratings', () => {
  const history = [entry(1, true), entry(2, false)];
  assert.equal(buildLogs(2, 'Thursday', history)['bench-press'][0].tooEasy, false);
  assert.deepEqual(buildLogs(1, 'Monday', history)['bench-press'].map(set => set.tooEasy), [true, false]);
});
test('new exercises and legacy entries default to unchecked', () => {
  assert.equal(buildLogs(1, 'Monday', [])['bench-press'][0].tooEasy, false);
  assert.equal(buildLogs(2, 'Thursday', [entry(1, undefined)])['bench-press'][0].tooEasy, false);
});
test('API stores and reads difficulty for the selected user', async () => {
  const { GET, POST } = await import(await moduleUrl('../app/api/progress/route.ts'));
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.SUPABASE_URL = 'https://example.test';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only';
  let saved;
  globalThis.fetch = async (url, init) => {
    if (init?.method === 'POST') { saved = JSON.parse(init.body); return new Response(null, { status: 201 }); }
    assert.ok(url.includes('eq.paulette'));
    return Response.json(url.includes('/w_workout_entries?') ? saved : []);
  };
  try {
    const headers = { 'x-workout-user': 'paulette', 'Content-Type': 'application/json' };
    const response = await POST(new Request('http://localhost/api/progress', { method: 'POST', headers, body: JSON.stringify({ type: 'strength', week: 1, day: 'Monday', entries: [entry(1, true), entry(2, false)] }) }));
    assert.equal(response.status, 201);
    assert.equal(saved[0].user_key, 'paulette');
    assert.deepEqual(saved.map(row => row.too_easy), [true, false]);
    const result = await (await GET(new Request('http://localhost/api/progress', { headers }))).json();
    assert.deepEqual(result.workouts.map(row => row.tooEasy), [true, false]);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  }
});

const { getFirstIncompleteWorkout, getCompletedWorkoutDays, strengthExercisesByDay, scheduledWorkoutDays, weeks } = await import(dataUrl);
const strengthEntries = (week, day) => (strengthExercisesByDay[day] ?? []).map(exercise => ({ week, day, exerciseId: exercise.id }));
const fullWeek = week => ({ workouts: Object.keys(strengthExercisesByDay).flatMap(day => strengthEntries(week, day)), cardio: ['Wednesday', 'Saturday'].map(day => ({ week, day })) });

test('new user starts at week one day one; partial strength and cardio finish remain incomplete', () => {
  for (const progress of [
    { workouts: [], cardio: [] },
    { workouts: strengthEntries(1, 'Monday').slice(0, 1), cardio: [{week: 1, day: 'Monday'}] },
  ]) {
    assert.deepEqual(getFirstIncompleteWorkout(progress), {week: 1, day: 'Monday', allComplete: false});
    assert.equal(getCompletedWorkoutDays(progress).has('1-Monday'), false);
  }
});
test('selects earliest gap, including cardio, regardless of later completed days', () => {
  const progress = fullWeek(1);
  progress.cardio = [{week: 1, day: 'Saturday'}];
  assert.deepEqual(getFirstIncompleteWorkout(progress), {week: 1, day: 'Wednesday', allComplete: false});
  progress.workouts = progress.workouts.filter(entry => entry.day !== 'Tuesday');
  assert.deepEqual(getFirstIncompleteWorkout(progress), {week: 1, day: 'Tuesday', allComplete: false});
});
test('completed week advances to next week and skips recovery day', () => {
  assert.deepEqual(getFirstIncompleteWorkout(fullWeek(1)), {week: 2, day: 'Monday', allComplete: false});
});
test('completed plan stays at the last workout and reports all complete', () => {
  const progress = {workouts: weeks.flatMap(({week}) => fullWeek(week).workouts), cardio: weeks.flatMap(({week}) => fullWeek(week).cardio)};
  assert.equal(getCompletedWorkoutDays(progress).size, weeks.length * scheduledWorkoutDays.length);
  assert.deepEqual(getFirstIncompleteWorkout(progress), {week: 8, day: 'Saturday', allComplete: true});
});
