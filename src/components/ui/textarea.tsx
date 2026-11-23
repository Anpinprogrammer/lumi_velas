import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Field, describedBy, fieldControl } from "./field";

type Props = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
};

export function Textarea({ label, hint, error, id, className, required, rows = 4, ...rest }: Props) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={fid}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(fid, hint, error)}
        className={cn(fieldControl, "py-3 leading-relaxed", error ? "border-error" : "border-border", className)}
        {...rest}
      />
    </Field>
  );
}
