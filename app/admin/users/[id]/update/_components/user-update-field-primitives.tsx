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
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
