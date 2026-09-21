"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowLeft, ArrowRight, BookOpen, Check, Dumbbell, Flame, HeartPulse, Plus, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cardioDays, getCompletedWorkoutDays, getFirstIncompleteWorkout, recoveryDays, scheduleDays, scheduledWorkoutDays, strengthDays, strengthExercisesByDay, toLocalDateKey, weeks, workoutDays, weeklyScheduledWorkoutCount } from "./workout-data";

import { buildLogs, updateFollowingSets, type SetLog } from "./workout-logs";

type ProgressData = { planStartDate: string | null; workouts: Array<{ week: number; day: string; exerciseId: string; setNumber: number; resistance: number; reps: number; tooEasy?: boolean; completedAt: string }>; cardio: Array<{ week: number; day: string; minutes: number; resistance: number; completedAt: string }>; weights: Array<{ week: number; weight: number; recordedAt: string }> };
const emptyProgress: ProgressData = { planStartDate: null, workouts: [], cardio: [], weights: [] };

function cardioDefaults(week: number, day: string) {
  const plan = weeks[week - 1];
  const target = cardioDays.has(day) ? plan.cardio : plan.strengthE95;
  return {
    minutes: target.match(/\d+/)?.[0] ?? "20",
    resistance: target.match(/level (\d+)/)?.[1] ?? "2",
  };
}

export default function Home() {
  const initialSelection = getFirstIncompleteWorkout(emptyProgress);
  const [week, setWeek] = useState(initialSelection.week);
  const [day, setDay] = useState(initialSelection.day);
  const [selectedUser, setSelectedUser] = useState("bill");
  const [activeExercise, setActiveExercise] = useState(0);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [logs, setLogs] = useState<Record<string, SetLog[]>>({});
  const [cardioMinutes, setCardioMinutes] = useState("20");
  const [cardioResistance, setCardioResistance] = useState("2");
  const [includeE95, setIncludeE95] = useState(true);
  const [weight, setWeight] = useState("");
  const [progress, setProgress] = useState<ProgressData>(emptyProgress);
  const [status, setStatus] = useState("");
  const plan = weeks[week - 1];
  const isStrength = strengthDays.has(day);
  const isRestDay = recoveryDays.has(day);
  const dayExercises = strengthExercisesByDay[day] ?? [];

  const progressRequest = (init?: RequestInit) => fetch("/api/progress", { ...init, headers: { "x-workout-user": selectedUser, ...(init?.headers ?? {}) } });
  useEffect(() => {
    let cancelled = false;
    fetch("/api/progress", { headers: { "x-workout-user": selectedUser } }).then((r) => {
      if (!r.ok) throw new Error("Progress request failed");
      return r.json();
    }).then((nextProgress: ProgressData) => {
      if (cancelled) return;
      const selection = getFirstIncompleteWorkout(nextProgress);
      const defaults = cardioDefaults(selection.week, selection.day);
      setStatus(selection.allComplete ? "All workouts complete!" : "");
      setProgress(nextProgress);
      setWeek(selection.week);
      setDay(selection.day);
      setActiveExercise(0);
      setLogs(buildLogs(selection.week, selection.day, nextProgress.workouts));
      setCardioMinutes(defaults.minutes);
      setCardioResistance(defaults.resistance);
    }).catch(() => { if (!cancelled) setStatus("Progress could not be loaded."); });
    return () => { cancelled = true; };
  }, [selectedUser]);

  const selectWorkout = (nextWeek: number, nextDay: string) => {
    const defaults = cardioDefaults(nextWeek, nextDay);
    setWeek(nextWeek);
    setDay(nextDay);
    setActiveExercise(0);
    setLogs(buildLogs(nextWeek, nextDay, progress.workouts));
    setCardioMinutes(defaults.minutes);
    setCardioResistance(defaults.resistance);
  };
  const refresh = async (nextWeek = week, nextDay = day) => { const response = await progressRequest(); if (response.ok) { const nextProgress = await response.json() as ProgressData; setProgress(nextProgress); setLogs(buildLogs(nextWeek, nextDay, nextProgress.workouts)); } };
  const updateSet = (exerciseId: string, index: number, field: "resistance" | "reps", value: string) => setLogs((current) => ({ ...current, [exerciseId]: updateFollowingSets(current[exerciseId], index, field, value) }));
  const addSet = () => setLogs((current) => ({ ...current, [exercise.id]: [...(current[exercise.id] ?? []), { ...(current[exercise.id]?.at(-1) ?? buildLogs(week, day, progress.workouts)[exercise.id][0]), tooEasy: false }] }));
  const saveCardio = async (showMessage = true) => { if (showMessage) setStatus("Saving…"); const response = await progressRequest({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "cardio", week, day, minutes: Number(cardioMinutes), resistance: Number(cardioResistance) }) }); if (showMessage) setStatus(response.ok ? "Cardio saved" : "Please check the time and resistance."); if (response.ok) await refresh(); };
  const saveWorkout = async () => {
    setStatus("Saving…");
    const response = await progressRequest({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "strength", week, day, entries: dayExercises.map((exercise) => (logs[exercise.id] ?? []).map((set, index) => ({ exerciseId: exercise.id, setNumber: index + 1, resistance: Number(set.resistance), reps: Number(set.reps), tooEasy: set.tooEasy }))).flat() }) });
    if (!response.ok) return setStatus("Please check every resistance and rep entry.");
    if (includeE95) await saveCardio(false); setStatus("Workout saved"); await refresh();
  };
  const saveWeight = async () => { setStatus("Saving…"); const response = await progressRequest({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "weight", week, day: workoutDays[0], weight: Number(weight) }) }); setStatus(response.ok ? "Weight saved" : "Please enter a valid weight."); if (response.ok) { setWeight(""); await refresh(); } };
  const startPlan = async () => {
    setStatus("Saving…");
    const startDate = toLocalDateKey();
    const response = await progressRequest({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "startPlan", startDate }) });
    setStatus(response.ok ? "Plan started" : "Plan could not be started.");
    if (response.ok) {
      const selection = getFirstIncompleteWorkout(progress);
      selectWorkout(selection.week, selection.day);
      await refresh(selection.week, selection.day);
    }
  };

  const completedDays = useMemo(() => getCompletedWorkoutDays(progress), [progress]);
  const completedCount = completedDays.size;
  const exercise = dayExercises[activeExercise];

  return <main>
    <header className="topbar"><div className="brand-mark"><Dumbbell /></div><div><p className="eyebrow">8-week plan</p><h1>Bowflex Workout Tracker</h1></div><div className="header-progress"><span>{completedCount} of {weeks.length * weeklyScheduledWorkoutCount} workouts</span><Progress value={(completedCount / (weeks.length * weeklyScheduledWorkoutCount)) * 100} /></div></header>
    <div className="app-shell">
      <section className="week-strip" aria-label="Choose workout">
        <label>Person<Select value={selectedUser} onValueChange={setSelectedUser}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bill">Bill</SelectItem><SelectItem value="paulette">Paulette</SelectItem></SelectContent></Select></label>
        <label>Week<Select value={String(week)} onValueChange={(value) => selectWorkout(Number(value), day)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{weeks.map((item) => <SelectItem key={item.week} value={String(item.week)}>Week {item.week}</SelectItem>)}</SelectContent></Select></label>
        <label>Workout<Select value={day} onValueChange={(value) => selectWorkout(week, value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{scheduleDays.map((item) => <SelectItem key={item} value={item}>Day {scheduleDays.indexOf(item) + 1}</SelectItem>)}</SelectContent></Select></label>
        <div className="week-actions">{!progress.planStartDate && <Button className="start-plan-button" onClick={startPlan}><Check />Start Plan</Button>}<div className="plan-pill"><Flame /><span><strong>{isRestDay ? "Recovery day" : isStrength ? `${plan.sets} set${plan.sets > 1 ? "s" : ""} · ${plan.reps} reps` : "Cardio day"}</strong>{isRestDay ? "Rest or take an easy walk" : isStrength ? `E95 finish: ${plan.strengthE95}` : plan.cardio}</span></div></div>
      </section>
      <Tabs defaultValue="workout" className="main-tabs">
        <TabsList className="tab-list"><TabsTrigger value="workout"><Activity />Workout</TabsTrigger><TabsTrigger value="progress"><Scale />Progress</TabsTrigger><TabsTrigger value="guide"><BookOpen />8-week plan</TabsTrigger></TabsList>
        <TabsContent value="workout">
          {isRestDay ? <section className="rest-card"><p className="eyebrow">Recovery day</p><h2>Take it easy</h2><p>Day 7 is a recovery day. An easy 10–20 minute walk is welcome, but there is no scheduled workout to log.</p></section> : isStrength ? <div className="workout-grid">
            <aside className="exercise-list" aria-label="Exercises">{dayExercises.map((item, index) => { const filled = (logs[item.id] ?? []).every((set) => set.resistance !== "" && set.reps !== ""); return <button key={item.id} className={index === activeExercise ? "active" : ""} onClick={() => setActiveExercise(index)}><span>{index + 1}</span><div><strong>{item.name}</strong><small>{item.category === "Accessory" ? "Accessory" : `${item.startResistance} lb starting total`}</small></div>{filled && <Check className="done-icon" />}</button>; })}</aside>
            <article className="exercise-card">{exercise.image ? <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}><DialogTrigger asChild><button type="button" className="exercise-image" aria-label={`View ${exercise.name} image fullscreen`}><img src={exercise.image} alt={`${exercise.category === "Accessory" ? "Accessory movement" : "Bowflex Xceed start and finish positions"} for ${exercise.name}`} /></button></DialogTrigger><DialogContent className="lightbox-content"><DialogTitle className="sr-only">{exercise.name}</DialogTitle><img className="lightbox-image" src={exercise.image} alt={`${exercise.category === "Accessory" ? "Accessory movement" : "Bowflex Xceed start and finish positions"} for ${exercise.name}`} /></DialogContent></Dialog> : <div className="exercise-image accessory-visual"><Dumbbell /><span>Accessory movement</span></div>}<div className="exercise-content">
              <div className="exercise-heading"><div><p className="eyebrow">{exercise.category === "Accessory" ? "Accessory" : `Exercise ${activeExercise + 1} of ${dayExercises.length}`}</p><h2>{exercise.name}</h2></div><span className="manual-badge">{exercise.category === "Accessory" ? "Accessory" : `Manual p. ${exercise.manualPage}`}</span></div>
              <dl className="setup-details"><div><dt>Equipment</dt><dd>{exercise.equipment ?? "Bowflex Xceed"}</dd></div><div><dt>Pulley</dt><dd>{exercise.pulley}</dd></div><div><dt>Attachment</dt><dd>{exercise.attachment}</dd></div><div><dt>Starting load</dt><dd>{exercise.startResistance === 0 ? "Bodyweight · 0 lb" : `${exercise.startResistance} lb`}</dd></div>{exercise.targetReps && <div><dt>Target</dt><dd>{exercise.targetReps}</dd></div>}</dl><section className="exercise-instructions" aria-label="Exercise instructions"><div><h3>Setup</h3><p>{exercise.setup}</p></div>{exercise.movement && <div><h3>Movement</h3><p>{exercise.movement}</p></div>}{exercise.formTips && <div><h3>Form and safety</h3><ul>{exercise.formTips.map((tip) => <li key={tip}>{tip}</li>)}</ul></div>}</section>
              <div className="set-header"><span>Set</span><span>{exercise.weightMeaning ?? "RESISTANCE (EACH SIDE LB)"}</span><span>Reps</span><span>Difficulty</span></div>{(logs[exercise.id] ?? []).map((set, index) => <div className="set-row" key={index}><strong>{index + 1}</strong><Input type="number" min="0" step="1" aria-label={`${exercise.name} set ${index + 1} weight`} value={set.resistance} onChange={(e) => updateSet(exercise.id, index, "resistance", e.target.value)} /><Input type="number" min="1" max="50" aria-label={`${exercise.name} set ${index + 1} repetitions`} value={set.reps} onChange={(e) => updateSet(exercise.id, index, "reps", e.target.value)} /><label className="set-difficulty"><input type="checkbox" aria-label={`${exercise.name} set ${index + 1} too easy`} checked={set.tooEasy} onChange={(e) => { const checked = e.target.checked; setLogs((current) => ({ ...current, [exercise.id]: current[exercise.id].map((item, i) => i === index ? { ...item, tooEasy: checked } : item) })); }} />Too Easy</label></div>)}
              <Button className="add-set-button" variant="outline" onClick={addSet}><Plus />Add set</Button>
              <div className="exercise-nav"><Button variant="outline" disabled={activeExercise === 0} onClick={() => setActiveExercise((i) => i - 1)}><ArrowLeft />Previous</Button>{activeExercise < dayExercises.length - 1 ? <Button onClick={() => setActiveExercise((i) => i + 1)}>Next exercise<ArrowRight /></Button> : <Button onClick={saveWorkout}><Check />Save workout</Button>}</div>
            </div></article>
            <CardioPanel planText={plan.strengthE95} minutes={cardioMinutes} resistance={cardioResistance} setMinutes={setCardioMinutes} setResistance={setCardioResistance} onSave={() => saveCardio()} includeFinish={includeE95} setIncludeFinish={setIncludeE95} compact />
          </div> : cardioDays.has(day) ? <CardioPanel planText={plan.cardio} minutes={cardioMinutes} resistance={cardioResistance} setMinutes={setCardioMinutes} setResistance={setCardioResistance} onSave={() => saveCardio()} /> : null}
          {status && <div className="toast" role="status">{status}</div>}
        </TabsContent>
        <TabsContent value="progress"><div className="progress-layout">
          <section className="weight-card"><div className="section-icon"><Scale /></div><div><p className="eyebrow">Weekly check-in</p><h2>Record your weight</h2><p>Weigh under similar conditions on the same morning each week.</p></div><div className="weight-entry"><Input type="number" min="1" step="0.1" placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} /><span>lb</span><Button onClick={saveWeight}>Save</Button></div></section>
                  <section className="history-card"><div className="section-heading"><div><p className="eyebrow">Consistency</p><h2>Eight-week progress</h2></div><strong>{Math.round((completedCount / (weeks.length * weeklyScheduledWorkoutCount)) * 100)}%</strong></div><div className="history-table"><div className="history-row history-head"><span>Week</span>{scheduledWorkoutDays.map((item) => <span key={item}>Day {scheduleDays.indexOf(item) + 1}</span>)}<span>Weight</span></div>{weeks.map((item) => { const weightEntry = progress.weights.find((x) => x.week === item.week); return <div className="history-row" key={item.week}><strong>{item.week}</strong>{scheduledWorkoutDays.map((workoutDay) => <span key={workoutDay} className={completedDays.has(`${item.week}-${workoutDay}`) ? "complete-dot" : "empty-dot"}>{completedDays.has(`${item.week}-${workoutDay}`) ? <Check /> : "—"}</span>)}<span>{weightEntry ? `${weightEntry.weight} lb` : "—"}</span></div>; })}</div></section>
        </div></TabsContent>
        <TabsContent value="guide"><section className="plan-card"><p className="eyebrow">Your weekly rhythm</p><h2>Build up gradually</h2><p className="guide-intro">Today is Day 1 until you start the plan. Starting the plan fixes today as your start date. Each week follows this sequence: Day 1: Upper Body A. Day 2: Lower Body A. Day 3: E95 cardio. Day 4: Upper Body B. Day 5: Lower Body B and Core. Day 6: E95 cardio. Day 7: recovery.</p><div className="plan-table"><div className="plan-row plan-head"><span>Week</span><span>Bowflex</span><span>After strength</span><span>Cardio days</span></div>{weeks.map((item) => <div className={item.week === week ? "plan-row current" : "plan-row"} key={item.week}><strong>{item.week}</strong><span>{item.sets} set{item.sets > 1 ? "s" : ""} × {item.reps}</span><span>{item.strengthE95}</span><span>{item.cardio}</span></div>)}</div><div className="safety-note"><HeartPulse /><p><strong>Safety:</strong> Use the lowest step height initially and keep stable support within reach for calf raises and step-ups. Stop for sharp or increasing joint pain, chest pain, faintness, or unusual shortness of breath. Maintain slow, controlled movement and repeat a week instead of progressing when form or recovery is poor. Increase dumbbell weight only after completing every repetition with controlled form and feeling capable of another two or three repetitions.</p></div></section></TabsContent>
      </Tabs>
    </div>
  </main>;
}

function CardioPanel({ planText, minutes, resistance, setMinutes, setResistance, onSave, includeFinish, setIncludeFinish, compact = false }: { planText: string; minutes: string; resistance: string; setMinutes: (value: string) => void; setResistance: (value: string) => void; onSave: () => void; includeFinish?: boolean; setIncludeFinish?: (value: boolean) => void; compact?: boolean }) {
  return <section className={compact ? "cardio-card compact" : "cardio-card"}><div className="cardio-orb"><HeartPulse /></div><div className="cardio-copy"><p className="eyebrow">SOLE E95</p><h2>{compact ? "Cardio finish" : "Today’s cardio"}</h2><p>Target: <strong>{planText}</strong>. Keep a smooth pace and use the talk test.</p></div><div className="cardio-fields"><label>Minutes<Input type="number" min="1" value={minutes} onChange={(e) => setMinutes(e.target.value)} /></label><label>Resistance<Input type="number" min="1" max="20" value={resistance} onChange={(e) => setResistance(e.target.value)} /></label>{compact && setIncludeFinish && <label className="finish-toggle"><input type="checkbox" checked={includeFinish} onChange={(e) => setIncludeFinish(e.target.checked)} /> Include finish</label>}<Button onClick={onSave}><Check />Save cardio</Button></div></section>;
}
