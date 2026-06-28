interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
}

export const PageHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  children,
}: PageHeaderProps) => {
  return (
    <div
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {eyebrow && (
        <span className="inline-block text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
          {eyebrow}
        </span>
      )}
      <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-wider mb-5">
        {title}
      </h1>
      <div
        className={`h-0.5 w-20 bg-gradient-to-r from-primary via-primary/60 to-transparent ${
          align === "center" ? "mx-auto" : ""
        } mb-6 opacity-60`}
      />
      {description && (
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          {description}
        </p>
      )}
      {children}
    </div>
  );
};

export default PageHeader;
