type SupabaseRow = Record<string, unknown>;

async function supabaseRequest(path: string, init?: RequestInit) {
  const baseUrl = String(process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? "");
  if (!baseUrl || !serviceRoleKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const response = await fetch(`${baseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Supabase request failed with status ${response.status}.`);
  }
  return response;
}

async function userKey(request: Request) {
  const selectedUser = request.headers.get("x-workout-user");
  if (selectedUser === "bill" || selectedUser === "paulette") {
    return selectedUser;
  }
  return null;
}

export async function GET(request: Request) {
  const key = await userKey(request);
  if (!key) return Response.json({ error: "Please choose a user." }, { status: 400 });
  const userFilter = encodeURIComponent(`eq.${key}`);
  const [workoutsResponse, cardioResponse, weightsResponse, planStartsResponse] = await Promise.all([
    supabaseRequest(`/w_workout_entries?select=*&user_key=${userFilter}&order=completed_at.desc`),
    supabaseRequest(`/w_cardio_entries?select=*&user_key=${userFilter}&order=completed_at.desc`),
    supabaseRequest(`/w_weekly_weights?select=*&user_key=${userFilter}&order=week.asc`),
    supabaseRequest(`/w_plan_starts?select=*&user_key=${userFilter}&limit=1`).catch(() => null),
  ]);
  const workouts = await workoutsResponse.json() as SupabaseRow[];
  const cardio = await cardioResponse.json() as SupabaseRow[];
  const weights = await weightsResponse.json() as SupabaseRow[];
  const planStarts = planStartsResponse ? await planStartsResponse.json() as SupabaseRow[] : [];
  return Response.json({
    planStartDate: planStarts[0]?.start_date ?? null,
    workouts: workouts.map((row) => ({
      week: row.week,
      day: row.day,
      exerciseId: row.exercise_id,
      setNumber: row.set_number,
      resistance: row.resistance,
      reps: row.reps,
      tooEasy: row.too_easy === true,
      completedAt: row.completed_at,
    })),
    cardio: cardio.map((row) => ({
      week: row.week,
      day: row.day,
      minutes: row.minutes,
      resistance: row.resistance,
      completedAt: row.completed_at,
    })),
    weights: weights.map((row) => ({
      week: row.week,
      weight: row.weight,
      recordedAt: row.recorded_at,
    })),
  });
}

export async function POST(request: Request) {
  const key = await userKey(request);
  if (!key) return Response.json({ error: "Please choose a user." }, { status: 400 });
  const body = await request.json() as Record<string, unknown>;
  const week = Number(body.week);
  const day = String(body.day ?? "");
  const now = new Date().toISOString();
  if (body.type === "startPlan") {
    const startDate = String(body.startDate ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      return Response.json({ error: "Invalid start date." }, { status: 400 });
    }
    const userFilter = encodeURIComponent(`eq.${key}`);
    await supabaseRequest(`/w_plan_starts?user_key=${userFilter}`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
    await supabaseRequest("/w_plan_starts", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{
        user_key: key,
        start_date: startDate,
        started_at: now,
      }]),
    });
  } else {
    if (!Number.isInteger(week) || week < 1 || week > 8 || !["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].includes(day)) {
      return Response.json({ error: "Invalid week or workout day." }, { status: 400 });
    }
    if (body.type === "strength") {
      const entries = Array.isArray(body.entries) ? body.entries as Array<Record<string, unknown>> : [];
      if (!entries.length) return Response.json({ error: "No exercise entries supplied." }, { status: 400 });
      await supabaseRequest("/w_workout_entries", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(entries.map((entry) => ({
          user_key: key,
          week,
          day,
          exercise_id: String(entry.exerciseId),
          set_number: Number(entry.setNumber),
          resistance: Number(entry.resistance),
          reps: Number(entry.reps),
          too_easy: entry.tooEasy === true,
          completed_at: now,
        }))),
      });
    } else if (body.type === "cardio") {
      await supabaseRequest("/w_cardio_entries", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify([{
          user_key: key,
          week,
          day,
          minutes: Number(body.minutes),
          resistance: Number(body.resistance),
          completed_at: now,
        }]),
      });
    } else if (body.type === "weight") {
      const userFilter = encodeURIComponent(`eq.${key}`);
      const weekFilter = encodeURIComponent(`eq.${week}`);
      await supabaseRequest(`/w_weekly_weights?user_key=${userFilter}&week=${weekFilter}`, {
        method: "DELETE",
        headers: { Prefer: "return=minimal" },
      });
      await supabaseRequest("/w_weekly_weights", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify([{
          user_key: key,
          week,
          weight: Number(body.weight),
          recorded_at: now,
        }]),
      });
    } else {
      return Response.json({ error: "Invalid entry type." }, { status: 400 });
    }
  }
  return Response.json({ ok: true }, { status: 201 });
}
