import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Field, describedBy, fieldControl } from "./field";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
};

export function Input({ label, hint, error, id, className, required, ...rest }: Props) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required}>
      <input
        id={fid}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, hint, error)}
        className={cn(fieldControl, "h-11", error ? "border-error" : "border-border", className)}
        {...rest}
      />
    </Field>
  );
}
