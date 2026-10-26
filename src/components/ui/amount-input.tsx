import * as React from "react";

interface AmountInputProps {
  id: string;
  label: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (value: number) => void;
}

/** Dollar input that lets the field be temporarily empty while typing. */
export function AmountInput({ id, label, value, min = 0, step = 1, onChange }: AmountInputProps) {
  const [text, setText] = React.useState(String(value));

  React.useEffect(() => {
    setText((prev) => (parseFloat(prev) === value ? prev : String(value)));
  }, [value]);

  return (
    <div>
      <label htmlFor={id} className="block text-sm text-stone-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">$</span>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            const n = parseFloat(e.target.value);
            if (Number.isFinite(n) && n >= min) onChange(n);
          }}
          onBlur={() => setText(String(value))}
          className="h-11 w-full rounded-lg border border-stone-300 bg-white pl-7 pr-3 text-base text-stone-900 focus:border-stone-900 focus:outline-none"
        />
      </div>
    </div>
  );
}
