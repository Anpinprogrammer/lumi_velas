import { useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Field, describedBy, fieldControl } from "./field";

type Option = { value: string; label: string };
type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  label: string;
  options: Option[];
  placeholder?: string;
  hint?: string;
  error?: string;
  id?: string;
};

/** Select nativo con estilo de marca: accesible y usable con teclado y lectores de pantalla por defecto. */
export function Select({ label, options, placeholder, hint, error, id, className, required, ...rest }: Props) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required}>
      <div className="relative">
        <select
          id={fid}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(fid, hint, error)}
          className={cn(fieldControl, "h-11 appearance-none pr-11", error ? "border-error" : "border-border", className)}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
      </div>
    </Field>
  );
}
