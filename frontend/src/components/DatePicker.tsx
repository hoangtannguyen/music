import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

interface DatePickerProps {
  name: string;
  min?: string;
  required?: boolean;
  ariaLabel: string;
  placeholder?: string;
  className?: string;
}

function toIso(year: number, month: number, day: number): string {
  return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function formatVi(iso: string): string {
  return iso.split("-").reverse().join("/");
}

// Vietnamese calendar popup; submits the value as YYYY-MM-DD through a hidden-looking text input
// so native form validation (required) and form.reset() keep working.
export default function DatePicker({ name, min, required, ariaLabel, placeholder = "Chọn ngày", className = "" }: DatePickerProps) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const start = min ? new Date(min + "T00:00") : new Date();
    return { year: start.getFullYear(), month: start.getMonth() };
  });
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  // Clear the selection when the parent form is reset after a successful submit
  useEffect(() => {
    const form = input.current?.form;
    if (!form) return;
    const onReset = () => setValue("");
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  // The "please pick a date" message set in onInvalid must not stick once a date is chosen
  useEffect(() => {
    input.current?.setCustomValidity("");
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (!open && value) {
      const [year, month] = value.split("-").map(Number);
      setView({ year, month: month - 1 });
    }
    setOpen(!open);
  }

  function shiftMonth(delta: number) {
    const date = new Date(view.year, view.month + delta, 1);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  }

  function select(iso: string) {
    setValue(iso);
    setOpen(false);
    trigger.current?.focus();
  }

  const now = new Date();
  const today = toIso(now.getFullYear(), now.getMonth(), now.getDate());
  const firstWeekday = (new Date(view.year, view.month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const minMonth = min ? min.slice(0, 7) : "";
  const canGoBack = !minMonth || toIso(view.year, view.month, 1).slice(0, 7) > minMonth;

  return (
    <div className="datepicker" ref={root}>
      <button
        ref={trigger}
        type="button"
        className={"datepicker-trigger " + className}
        aria-label={ariaLabel + (value ? ": " + formatVi(value) : "")}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className={value ? "" : "datepicker-placeholder"}>{value ? formatVi(value) : placeholder}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
      </button>
      <input
        ref={input}
        className="datepicker-value"
        name={name}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        onChange={() => {}}
        onFocus={() => trigger.current?.focus()}
        onInvalid={(event) => event.currentTarget.setCustomValidity(value ? "" : "Vui lòng chọn " + ariaLabel.toLowerCase())}
      />

      {open && (
        <div className="datepicker-popup" role="dialog" aria-label={"Chọn " + ariaLabel.toLowerCase()}>
          <div className="datepicker-head">
            <button type="button" aria-label="Tháng trước" disabled={!canGoBack} onClick={() => shiftMonth(-1)}>‹</button>
            <strong>Tháng {view.month + 1}, {view.year}</strong>
            <button type="button" aria-label="Tháng sau" onClick={() => shiftMonth(1)}>›</button>
          </div>
          <div className="datepicker-grid">
            {WEEKDAYS.map((day) => <span key={day} className="datepicker-weekday">{day}</span>)}
            {Array.from({ length: firstWeekday }, (_, index) => <span key={"blank-" + index} />)}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const iso = toIso(view.year, view.month, index + 1);
              const classes = ["datepicker-day", iso === value && "selected", iso === today && "today"].filter(Boolean).join(" ");
              return (
                <button
                  key={iso}
                  type="button"
                  className={classes}
                  disabled={!!min && iso < min}
                  aria-label={formatVi(iso)}
                  aria-pressed={iso === value}
                  onClick={() => select(iso)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="datepicker-foot">
            <button type="button" disabled={!!min && today < min} onClick={() => select(today)}>Hôm nay</button>
            <button type="button" onClick={() => { setValue(""); setOpen(false); }}>Xóa</button>
          </div>
        </div>
      )}
    </div>
  );
}
