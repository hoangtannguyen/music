interface FilterTabsProps {
  options: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  label: string;
}

// "all" is always the first tab
export default function FilterTabs({ options, value, onChange, label }: FilterTabsProps) {
  const tabs = [["all", "Tất cả"], ...Object.entries(options)];

  return (
    <div className="filter-tabs" role="group" aria-label={label}>
      {tabs.map(([key, name]) => (
        <button
          key={key}
          className={"filter-tab" + (key === value ? " active" : "")}
          type="button"
          aria-pressed={key === value}
          onClick={() => onChange(key)}
        >
          {name}
        </button>
      ))}
    </div>
  );
}
