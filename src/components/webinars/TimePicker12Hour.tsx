"use client";

import { useEffect, useState } from "react";

interface TimePicker12HourProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function TimePicker12Hour({
  label,
  value,
  onChange,
  required = false,
}: TimePicker12HourProps) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [period, setPeriod] = useState("");

  useEffect(() => {
    if (!value) {
      setHour("");
      setMinute("");
      setPeriod("");
      return;
    }

    const [hours24, minutes] = value.split(":").map(Number);
    setHour(String((hours24 % 12) || 12).padStart(2, "0"));
    setMinute(String(minutes).padStart(2, "0"));
    setPeriod(hours24 >= 12 ? "PM" : "AM");
  }, [value]);

  const updateTime = (nextHour: string, nextMinute: string, nextPeriod: string) => {
    setHour(nextHour);
    setMinute(nextMinute);
    setPeriod(nextPeriod);

    if (!nextHour || !nextMinute || !nextPeriod) {
      onChange("");
      return;
    }

    let hours24 = Number(nextHour) % 12;
    if (nextPeriod === "PM") hours24 += 12;
    onChange(`${String(hours24).padStart(2, "0")}:${nextMinute}`);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-600">{label} *</label>
      <div className="grid grid-cols-3 gap-2">
        <select
          required={required}
          aria-label={`${label} hour`}
          value={hour}
          onChange={(event) => updateTime(event.target.value, minute, period)}
          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800 text-sm"
        >
          <option value="" disabled>Hour</option>
          {Array.from({ length: 12 }, (_, index) => {
            const option = String(index + 1).padStart(2, "0");
            return <option key={option} value={option}>{option}</option>;
          })}
        </select>
        <select
          required={required}
          aria-label={`${label} minute`}
          value={minute}
          onChange={(event) => updateTime(hour, event.target.value, period)}
          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800 text-sm"
        >
          <option value="" disabled>Minute</option>
          {Array.from({ length: 60 }, (_, index) => {
            const option = String(index).padStart(2, "0");
            return <option key={option} value={option}>{option}</option>;
          })}
        </select>
        <select
          required={required}
          aria-label={`${label} AM or PM`}
          value={period}
          onChange={(event) => updateTime(hour, minute, event.target.value)}
          className="w-full bg-pink-50/10 border border-border/80 rounded-xl px-3.5 py-2 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none text-slate-800 text-sm"
        >
          <option value="" disabled>AM/PM</option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
