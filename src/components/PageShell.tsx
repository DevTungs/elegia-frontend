import { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  withFooter?: boolean;
  withNav?: boolean;
}

export const PageShell = ({
  children,
  className = "",
  withFooter = true,
  withNav = true,
}: PageShellProps) => {
  return (
    <div className={`min-h-screen flex flex-col page-gradient ${className}`}>
      {withNav && <Navigation />}
      <main className="flex-1">{children}</main>
      {withFooter && <Footer />}
    </div>
  );
};

export default PageShell;
