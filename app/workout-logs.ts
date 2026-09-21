import { strengthExercisesByDay, weeks } from "./workout-data";

export type SetLog = { resistance: string; reps: string; tooEasy: boolean };
type WorkoutEntry = { week: number; day: string; exerciseId: string; setNumber: number; resistance: number; reps: number; tooEasy?: boolean; completedAt: string };

export function buildLogs(week: number, day: string, workouts: WorkoutEntry[]) {
  const plan = weeks[week - 1];
  const next: Record<string, SetLog[]> = {};
  for (const exercise of strengthExercisesByDay[day] ?? []) {
    const history = workouts.filter((entry) => entry.exerciseId === exercise.id)
      .sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt) || b.setNumber - a.setNumber);
    const saved = history.filter((entry) => entry.week === week && entry.day === day);
    let previous: SetLog = {
      tooEasy: history[0]?.tooEasy ?? false,
      resistance: String(history[0]?.resistance ?? exercise.startResistance),
      reps: String(history[0]?.reps ?? (exercise.targetReps ?? plan.reps).match(/\d+/)?.[0] ?? "10"),
    };
    next[exercise.id] = Array.from({ length: Math.max(plan.sets, ...saved.map((entry) => entry.setNumber)) }, (_, index) => {
      const entry = saved.find((item) => item.setNumber === index + 1);
      if (entry) previous = { resistance: String(entry.resistance), reps: String(entry.reps), tooEasy: entry.tooEasy ?? false };
      return { ...previous, tooEasy: entry ? entry.tooEasy ?? false : index === 0 && previous.tooEasy };
    });
  }
  return next;
}

export function updateFollowingSets(sets: SetLog[], index: number, field: "resistance" | "reps", value: string) {
  const previous = sets[index][field];
  let following = true;
  return sets.map((set, i) => {
    if (i < index) return set;
    // Stop at a later set that already has its own value.
    if (i > index && set[field] !== previous) following = false;
    return i === index || following ? { ...set, [field]: value } : set;
  });
}
