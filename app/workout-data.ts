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
  category?: "Bowflex" | "Accessory";
  setup: string;
};

export const exercises: Exercise[] = [
  { id: "bench-press", name: "Bench Press", image: "/exercises/bench_press.png", manualPage: 20, pulley: "Center Cross Bar — wide position", attachment: "Hand grips", startResistance: 20, setup: "Sit facing away from the rods. Keep your shoulder blades down and elbows slightly below shoulder height." },
  { id: "seated-lat-row", name: "Seated Lat Rows", image: "/exercises/seated_lat_rows.png", manualPage: 33, pulley: "Squat Pulley Frame", attachment: "Hand grips", startResistance: 20, setup: "Sit facing the rods with knees bent. Keep your chest lifted and pull the grips toward your torso." },
  { id: "leg-extension", name: "Leg Extension", image: "/exercises/leg_extension.png", manualPage: 48, pulley: "Squat Pulley Frame", attachment: "Leg Extension", startResistance: 20, setup: "Sit with knees aligned with the leg-extension pivot. Place the roller pads across the front of your lower legs." },
  { id: "shoulder-press", name: "Seated Shoulder Press", image: "/exercises/shoulder_press.png", manualPage: 25, pulley: "Center Cross Bar — wide position", attachment: "Hand grips", startResistance: 10, setup: "Sit facing away from the rods. Start with elbows bent and grips just above shoulder level." },
  { id: "biceps-curl", name: "Biceps Curl", image: "/exercises/biceps_curl.png", manualPage: 41, pulley: "Squat Pulley Frame", attachment: "Hand grips", startResistance: 10, setup: "Stand facing the rods with arms at your sides. Keep your elbows close to your body as you curl." },
  { id: "triceps-pushdown", name: "Triceps Pushdown", image: "/exercises/triceps_pushdown.png", manualPage: 37, pulley: "Lat Tower", attachment: "Hand grips", startResistance: 10, setup: "Stand facing the machine with elbows tucked at your sides. Press down without moving your upper arms." },
  { id: "abdominal-crunch", name: "Seated Abdominal Crunch", image: "/exercises/abdominal_crunch.png", manualPage: 47, pulley: "Abdominal bar", attachment: "Shoulder harness", startResistance: 20, setup: "Sit facing away from the rods with the harness over your shoulders. Curl your rib cage toward your hips." },
];

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

export const programStartDate = "2026-09-03";
export const programDays = ["Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
export const workoutDays = scheduledWorkoutDays;
export const scheduleDays = scheduledDays;
export const strengthDays = new Set(Object.keys(strengthExercisesByDay));

export function getInitialProgramSelection(today = new Date()) {
  const start = new Date(`${programStartDate}T00:00:00`);
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const elapsedDays = Math.floor((current.getTime() - start.getTime()) / 86400000);
  const dayIndex = Math.max(0, Math.min(elapsedDays, weeks.length * 7 - 1));
  return {
    week: Math.floor(dayIndex / 7) + 1,
    day: programDays[dayIndex % programDays.length],
  };
}
