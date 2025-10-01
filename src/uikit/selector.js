"use client";
import Dropdown from "./dropdown";
import IconCheckSimple from "@/uikit/icons/check-simple";
import DownIcon from "@/uikit/icons/down";

export default function Selector({
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  optional = false,
  error = false,
  visible = true,
  multiSelect = false,
  maxSelections = null,
}) {
  const selectorStyles = `input cursor-pointer  ${
    error ? "border-red-400 ring-red-400" : ""
  }`;

  // Support options as array of objects { label, value } or as strings
  const normalizedOptions = options.map((option) =>
    typeof option === "object"
      ? { label: option.label, value: option.value }
      : { label: option, value: option }
  );

  const handleOptionClick = (option, closeDropdown) => {
    if (multiSelect) {
      const currentValues = Array.isArray(value) ? value : [];
      const isSelected = currentValues.includes(option.value);

      if (isSelected) {
        // Remove option
        const newValues = currentValues.filter((v) => v !== option.value);
        onChange(newValues);
      } else {
        // Add option if under max limit
        if (!maxSelections || currentValues.length < maxSelections) {
          const newValues = [...currentValues, option.value];
          onChange(newValues);
        }
      }
    } else {
      onChange(option.value);
      closeDropdown();
    }
  };

  const displayValue = () => {
    if (multiSelect && Array.isArray(value)) {
      // Show labels for selected values
      const selectedLabels = normalizedOptions
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label);
      return selectedLabels.length > 0 ? selectedLabels.join(", ") : "";
    }
    // Show label for selected value
    const selected = normalizedOptions.find((opt) => opt.value === value);
    return selected ? selected.label : "";
  };

  const isOptionSelected = (option) => {
    if (multiSelect && Array.isArray(value)) {
      return value.includes(option.value);
    }
    return value === option.value;
  };

  const toggleContent = (
    <button
      type="button"
      className={`${selectorStyles} text-left flex items-center justify-between`}
    >
      {!multiSelect && displayValue() ? (
        displayValue()
      ) : (
        <span className="text-neutral-400">{placeholder}</span>
      )}
      <DownIcon size={20} className="transition-transform duration-200" />
    </button>
  );

  return (
    <div className={`flex flex-col gap-2 ${visible ? "" : "hidden"}`}>
      <label className="input-label">
        {label}
        {optional && (
          <span className="text-xs text-neutral-800"> (Optional)</span>
        )}
        {multiSelect && maxSelections && (
          <span className="text-xs text-neutral-800">
            {" "}
            (Up to {maxSelections})
          </span>
        )}
      </label>
      <div className="relative">
        <Dropdown
          toggleContent={toggleContent}
          dropdownSize="auto"
          dropdownOrientation="bottom"
          horizontalPosition="left"
        >
          {(closeDropdown) => (
            <div className="flex flex-col gap-1">
              {normalizedOptions.map((option, index) => (
                <div
                  key={index}
                  className={`dropdown-cell justify-between ${
                    isOptionSelected(option) ? "bg-neutral-100" : ""
                  }`}
                  onClick={() => handleOptionClick(option, closeDropdown)}
                >
                  <span>{option.label}</span>
                  {isOptionSelected(option) && <IconCheckSimple size={20} />}
                </div>
              ))}
            </div>
          )}
        </Dropdown>
      </div>
    </div>
  );
}
