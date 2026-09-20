import React, { useCallback, useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { readJson } from "./auth.js";

// The daily target, and the run of days it has been met.
//
// The target is a length of time converted into questions using the learner's
// own pace, so it asks the same commitment of everyone rather than the same
// output. A learner who needs longer to think is set fewer questions, not
// given a goal they cannot reach.
//
// Deliberately quiet: a number, a bar, and a fortnight of dots. Habit is built
// by turning up, and a widget that celebrates too loudly on day one has
// nothing left to say on day thirty.
const weekday = (date) => new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London", weekday: "narrow",
}).format(new Date(`${date}T12:00:00Z`));

export function DailyGoal({ request, refreshKey = 0 }) {
  const [habit, setHabit] = useState(null);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    try {
      const response = await request("/api/progress/habit");
      if (!response.ok) throw new Error("unavailable");
      setHabit(await readJson(response));
      setStatus("ready");
    } catch {
      // A missing target is not worth an error message on the lesson page.
      setStatus("error");
    }
  }, [request]);

  useEffect(() => { load(); }, [load, refreshKey]);

  if (status !== "ready" || !habit) return null;

  const percent = Math.min(100, (habit.today / habit.goal) * 100);

  return <section className="daily-goal" aria-label="Today's goal">
    <div className="goal-main">
      <div className="goal-count">
        <strong>{habit.today}</strong>
        <span>of {habit.goal} questions today</span>
      </div>
      <p className="goal-note">
        {habit.metToday
          ? "Done for today. Anything more is a bonus."
          : `About ${habit.targetMinutes} minutes. ${habit.remaining} to go.`}
      </p>
    </div>

    <div className="goal-track" role="progressbar"
      aria-valuemin={0} aria-valuemax={habit.goal} aria-valuenow={habit.today}
      aria-label={`${habit.today} of ${habit.goal} questions answered today`}>
      <span className={habit.metToday ? "met" : ""} style={{ width: `${percent}%` }} />
    </div>

    <div className="goal-streak">
      {/* A streak of one day is just "today", and calling that a streak cheapens
          the word before it has earned anything. */}
      {habit.streak > 1 && <span className="streak-count">
        <Flame size={15} /> {habit.streak} day streak
      </span>}
      <ol className="goal-days">
        {habit.days.map((day) => (
          <li className={day.met ? "met" : day.count ? "partial" : ""} key={day.date}
            title={`${day.date}: ${day.count} ${day.count === 1 ? "question" : "questions"}`}>
            <span aria-hidden="true">{weekday(day.date)}</span>
            <span className="visually-hidden">
              {day.date}: {day.count} answered{day.met ? ", goal met" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  </section>;
}
