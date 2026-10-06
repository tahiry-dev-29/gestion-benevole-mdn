import { Label } from "@/components/ui/label";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-sm flex flex-col gap-5 rounded-lg p-4 sm:p-6">
      <h2 className="border-b pb-3 text-sm font-semibold text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function FormField({
  label,
  error,
  dirty,
  touched,
  children,
}: {
  label: string;
  error?: string;
  dirty?: boolean;
  touched?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5" data-invalid={!!error}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div
        className={
          error
            ? "[&_input]:!border-destructive [&_input]:!bg-destructive/10 [&_input]:!ring-2 [&_input]:!ring-destructive/30 [&_button[data-slot=select-trigger]]:!border-destructive [&_button[data-slot=select-trigger]]:!bg-destructive/10 [&_button[data-slot=select-trigger]]:!ring-2 [&_button[data-slot=select-trigger]]:!ring-destructive/30 [&_[data-slot=checkbox]]:!border-destructive [&_[data-slot=checkbox]]:!bg-destructive/10"
            : dirty || touched
              ? "[&_input]:!border-primary/70 [&_input]:!bg-primary/10 [&_input]:!ring-2 [&_input]:!ring-primary/20 [&_button[data-slot=select-trigger]]:!border-primary/70 [&_button[data-slot=select-trigger]]:!bg-primary/10 [&_[data-slot=checkbox]]:!border-primary/70"
              : ""
        }
      >
        {children}
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
