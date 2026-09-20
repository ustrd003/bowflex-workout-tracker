export type Exercise = {
  id: string;
  name: string;
  image?: string;
  manualPage?: number;
  pulley: string;
  attachment: string;
  startResistance: number;
  weightMeaning?: string;
  targetReps?: string;
  equipment?: string;
  instructions?: string;
  movement?: string;
  formTips?: string[];
  category?: "Bowflex" | "Accessory";
  setup: string;
};

const baseExercises: Exercise[] = [
  { id: "bench-press", name: "Bench Press", image: "/exercises/bench-press.png", manualPage: 20, pulley: "Center Cross Bar — wide position", attachment: "Hand grips", startResistance: 20, setup: "Sit facing away from the rods. Keep your shoulder blades down and elbows slightly below shoulder height." },
  { id: "seated-lat-row", name: "Seated Lat Rows", image: "/exercises/seated-lat-row.png", manualPage: 33, pulley: "Squat Pulley Frame", attachment: "Hand grips", startResistance: 20, setup: "Sit facing the rods with knees bent. Keep your chest lifted and pull the grips toward your torso." },
  { id: "leg-extension", name: "Leg Extension", image: "/exercises/leg-extension.png", manualPage: 48, pulley: "Squat Pulley Frame", attachment: "Leg Extension", startResistance: 20, setup: "Sit with knees aligned with the leg-extension pivot. Place the roller pads across the front of your lower legs." },
  { id: "shoulder-press", name: "Seated Shoulder Press", image: "/exercises/shoulder-press.png", manualPage: 25, pulley: "Center Cross Bar — wide position", attachment: "Hand grips", startResistance: 10, setup: "Sit facing away from the rods. Start with elbows bent and grips just above shoulder level." },
  { id: "biceps-curl", name: "Biceps Curl", image: "/exercises/biceps-curl.png", manualPage: 41, pulley: "Squat Pulley Frame", attachment: "Hand grips", startResistance: 10, setup: "Stand facing the rods with arms at your sides. Keep your elbows close to your body as you curl." },
  { id: "triceps-pushdown", name: "Triceps Pushdown", image: "/exercises/triceps-pushdown.png", manualPage: 37, pulley: "Lat Tower", attachment: "Hand grips", startResistance: 10, setup: "Stand facing the machine with elbows tucked at your sides. Press down without moving your upper arms." },
  { id: "abdominal-crunch", name: "Seated Abdominal Crunch", image: "/exercises/abdominal-crunch.png", manualPage: 47, pulley: "Abdominal bar", attachment: "Shoulder harness", startResistance: 20, setup: "Sit facing away from the rods with the harness over your shoulders. Curl your rib cage toward your hips." },
];

const bowflexInstructions: Record<string, Pick<Exercise, "setup" | "movement" | "formTips">> = {
  "bench-press": {
    setup: "Remove the Leg Extension attachment and adjust the seat height. Sit facing away from the Power Rods. Hold the hand grips with your arms extended in front of you. Keep your arms aligned with the cables, palms facing down and wrists straight. Lift your chest and gently draw your shoulder blades together.",
    movement: "Slowly move your elbows outward while bending your arms. Keep your forearms aligned with the cables. Stop when your upper arms are level with your shoulders, then press forward smoothly until your arms return to the starting position.",
    formTips: ["Keep approximately a 90-degree angle between your upper arms and torso.", "Do not allow your elbows to travel behind your shoulders.", "Keep your shoulder blades gently drawn together.", "Do not lock your elbows.", "Use slow, controlled movement."],
  },
  "seated-lat-row": {
    setup: "Remove the Leg Extension attachment and seat. Sit facing the machine with your heels against the end of the platform and your knees comfortably bent. Hold the hand grips with your palms facing one another. Sit upright with your chest lifted and spine in a neutral position.",
    movement: "Pull your upper arms down and backward, keeping them close to the sides of your body. Keep your forearms pointing in the direction of the cables. Gently squeeze your shoulder blades together, then return slowly to the starting position.",
    formTips: ["Do not bend your torso forward.", "Keep your chest lifted and spine aligned.", "Avoid shrugging your shoulders.", "Allow the shoulder blades to release at the end of each repetition before beginning the next pull.", "Do not jerk the cables."],
  },
  "leg-extension": {
    setup: "Adjust the seat height. Sit facing away from the machine with your knees close to the Leg Extension pivot point and the lower roller pads resting across your shins. Keep your thighs approximately hip-width apart with your kneecaps pointing forward. Hold the sides of the seat and sit upright with your chest lifted and abdomen braced.",
    movement: "Tighten your quadriceps and straighten your legs forward and upward. Stop just before locking your knees. Pause briefly, then return slowly while maintaining tension in the front of your thighs.",
    formTips: ["Do not kick into the movement.", "Do not lock your knees.", "Keep your kneecaps pointing forward.", "Do not allow your knees to rotate outward.", "Keep your back supported and your abdomen braced."],
  },
  "shoulder-press": {
    setup: "Remove the Leg Extension attachment and adjust the seat height. Sit facing away from the Power Rods with your knees bent and feet flat. Hold the grips just above shoulder level with your palms facing forward. Keep your chest lifted, abdomen braced and lower back in a comfortable neutral position.",
    movement: "Press the grips upward by straightening your arms. Keep your elbows moving upward and slightly inward. Stop just before locking your elbows, then return slowly to the starting position.",
    formTips: ["Keep your abdomen braced throughout the movement.", "Do not exaggerate the arch in your lower back.", "Keep your wrists straight.", "Avoid shrugging your shoulders.", "Do not lock your elbows."],
  },
  "biceps-curl": {
    setup: "Remove the seat and Leg Extension attachment. Stand on the platform facing the machine. Hold the grips with your palms facing forward. Stand upright with your upper arms close to your sides, chest lifted and abdomen braced.",
    movement: "Keep your upper arms still as you curl the grips forward, upward and toward your shoulders. Pause briefly at the top, then lower the grips slowly along the same path.",
    formTips: ["Keep your elbows close to your sides.", "Do not swing your torso.", "Keep your wrists straight.", "Maintain a neutral spine.", "Do not allow the resistance to pull your arms down quickly."],
  },
  "triceps-pushdown": {
    setup: "Remove the seat and Leg Extension attachment. Stand on the platform facing the machine. Hold the grips approximately shoulder-width apart with your palms facing down. Keep your elbows close to your sides. Hinge forward slightly from the hips while keeping your chest lifted and spine neutral.",
    movement: "Keep your upper arms stationary. Allow your elbows to bend until they reach approximately 90 degrees, then press the grips downward by straightening your arms. Stop before forcefully locking your elbows and return slowly.",
    formTips: ["Keep your upper arms still and your elbows beside your torso.", "Keep your wrists straight.", "Maintain a neutral spine.", "Keep your abdomen braced.", "Do not use body momentum to push the grips downward."],
  },
  "abdominal-crunch": {
    setup: "Remove the Leg Extension attachment. Connect the shoulder harness to the D-rings and place it over your shoulders with the handles hanging over your chest or thighs. Hold both handles. Sit with your feet flat, knees bent and lower back in a comfortable neutral position.",
    movement: "Tighten your abdominal muscles and curl your torso forward by bringing your ribs toward your hips. Move only as far as possible without moving your hips or pulling with your neck. Return slowly without completely relaxing your abdominal muscles.",
    formTips: ["Exhale while curling forward and inhale while returning.", "Do not pull your head or chin forward.", "Keep your neck aligned with your spine.", "Keep your abdominal muscles engaged throughout the set.", "Do not use momentum.", "Maintain contact between your lower back and the bench at the fully contracted position."],
  },
};

export const exercises: Exercise[] = baseExercises.map((exercise) => ({
  ...exercise,
  image: `/exercises/${exercise.id === "seated-lat-row" ? "seated-lat-row" : exercise.id.replace(/_/g, "-")}.png`,
  ...bowflexInstructions[exercise.id],
}));

const accessoryExercise = (exercise: Omit<Exercise, "category">): Exercise => ({ ...exercise, category: "Accessory" });

export const accessoryExercises: Record<string, Exercise[]> = {
  Monday: [
    accessoryExercise({ id: "goblet-squat", name: "Dumbbell Goblet Squat", image: "/exercises/goblet-squat.png", pulley: "None", attachment: "None", startResistance: 10, weightMeaning: "Single dumbbell; log its weight", equipment: "One 10 lb dumbbell; available: 2, 3, 5, 10, 15 lb", setup: "Set up with feet approximately shoulder-width apart, chest tall, and the dumbbell held close to the chest.", instructions: "Start with one 10 lb dumbbell held vertically at the chest. Sit the hips down and back only as far as comfortable, keep the knees tracking with the toes, and push through the whole foot to stand. Follow the current week’s set and repetition progression." }),
    accessoryExercise({ id: "calf-raise", name: "Calf Raise on Step", image: "/exercises/calf-raise-step.png", pulley: "None", attachment: "None", startResistance: 0, weightMeaning: "Combined total; bodyweight is 0 lb", targetReps: "12–15", equipment: "Exercise step and stable support", setup: "Use the lowest step height and keep stable support within reach. Place only the balls of both feet near the edge, allow the heels to lower gently, rise onto the toes, pause, and lower slowly.", instructions: "Start with bodyweight. When 15 controlled repetitions are easy, suggest holding a 5 lb dumbbell in each hand and logging 10 lb total." }),
  ],
  Wednesday: [
    accessoryExercise({ id: "dumbbell-rdl", name: "Dumbbell Romanian Deadlift", image: "/exercises/dumbbell-rdl.png", pulley: "None", attachment: "None", startResistance: 20, weightMeaning: "Combined total; 10 lb in each hand", equipment: "Two 10 lb dumbbells; available: 2, 3, 5, 10, 15 lb", setup: "Hold the dumbbells in front of the thighs, soften the knees, brace the abdomen, and maintain a neutral back.", instructions: "Start with 10 lb in each hand, recorded as 20 lb total. Push the hips backward while keeping the dumbbells close to the legs, stop when the hamstrings feel comfortably stretched, and squeeze the glutes to stand. This is a hip hinge, not a squat. Follow the current week’s set and repetition progression." }),
    accessoryExercise({ id: "glute-bridge", name: "Glute Bridge", image: "/exercises/glute-bridge.png", pulley: "None", attachment: "None", startResistance: 0, weightMeaning: "Combined total; bodyweight is 0 lb", targetReps: "12–15", equipment: "Exercise mat", setup: "Lie face-up with knees bent, feet flat, and arms relaxed at the sides.", instructions: "Start with bodyweight. Brace the abdomen, squeeze the glutes, lift the hips without excessively arching the lower back, pause, and lower slowly. When bodyweight becomes easy, suggest placing one 10 lb dumbbell securely across the hips." }),
  ],
  Friday: [
    accessoryExercise({ id: "lateral-raise", name: "Dumbbell Lateral Raise", image: "/exercises/lateral-raise.png", pulley: "None", attachment: "None", startResistance: 6, weightMeaning: "Combined total; 3 lb in each hand", equipment: "Two 3 lb dumbbells; available: 2, 3, 5, 10, 15 lb", setup: "Stand tall with elbows softly bent and shoulders down.", instructions: "Start with 3 lb in each hand, recorded as 6 lb total. Raise the arms only to shoulder height, avoid shrugging or swinging, and lower slowly. Use the 2 lb dumbbells if 3 lb affects form. Follow the current week’s set and repetition progression." }),
    accessoryExercise({ id: "step-up", name: "Step-Up", image: "/exercises/step-up.png", pulley: "None", attachment: "None", startResistance: 0, weightMeaning: "Combined total; bodyweight is 0 lb", targetReps: "8 per leg", equipment: "Exercise step and stable support", setup: "Use the lowest step height with a wall, rail, or other stable support within reach. Place the entire working foot on the platform.", instructions: "Start with bodyweight. Push through the working foot to stand and lower under control. Avoid pushing off forcefully with the foot that remains on the floor. Once balance and control are solid, suggest holding a 5 lb dumbbell in each hand and logging 10 lb total." }),
  ],
};

export const accessoryDays = new Set(Object.keys(accessoryExercises));

export const strengthExercisesByDay: Record<string, Exercise[]> = {
  Monday: [exercises[0], exercises[1], exercises[3], exercises[4]],
  Tuesday: [exercises[2], accessoryExercises.Monday[0], accessoryExercises.Monday[1], accessoryExercises.Wednesday[1]],
  Thursday: [exercises[0], exercises[1], exercises[5], accessoryExercises.Friday[0]],
  Friday: [exercises[2], exercises[6], accessoryExercises.Wednesday[0], accessoryExercises.Friday[1]],
};

export const cardioDays = new Set(["Wednesday", "Saturday"]);
export const recoveryDays = new Set(["Sunday"]);
export const scheduledDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const scheduledWorkoutDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const weeklyScheduledWorkoutCount = 6;

export const weeks = [
  { week: 1, sets: 1, reps: "10", strengthE95: "8 min · level 2", cardio: "20 min · level 2" },
  { week: 2, sets: 1, reps: "10–12", strengthE95: "10 min · level 2", cardio: "22 min · level 2" },
  { week: 3, sets: 1, reps: "12", strengthE95: "10 min · level 3", cardio: "25 min · level 3" },
  { week: 4, sets: 1, reps: "12–15", strengthE95: "12 min · level 3", cardio: "28 min · level 3" },
  { week: 5, sets: 2, reps: "10", strengthE95: "12 min · level 3", cardio: "30 min · level 3" },
  { week: 6, sets: 2, reps: "10–12", strengthE95: "15 min · level 3", cardio: "32 min · level 4" },
  { week: 7, sets: 2, reps: "12", strengthE95: "15 min · level 4", cardio: "35 min · level 4; 3 × 1 min at 5" },
  { week: 8, sets: 2, reps: "12–15", strengthE95: "15 min · level 4", cardio: "35 min · level 4; 4 × 1 min at 5" },
];

export const workoutDays = scheduledWorkoutDays;
export const scheduleDays = scheduledDays;
export const strengthDays = new Set(Object.keys(strengthExercisesByDay));

export function toLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getInitialProgramSelection(startDate?: string | null, today = new Date()) {
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!startDate) {
    return { week: 1, day: scheduledDays[0] };
  }
  const start = dateFromKey(startDate);
  // Compare calendar dates so daylight-saving changes do not shift a workout day.
  const elapsedDays = Math.floor((Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / 86400000);
  const dayIndex = Math.max(0, Math.min(elapsedDays, weeks.length * 7 - 1));
  return {
    week: Math.floor(dayIndex / 7) + 1,
    day: scheduledDays[dayIndex % 7],
  };
}
