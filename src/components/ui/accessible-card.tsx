import * as React from "react"
import { cn } from "@/lib/utils"
import { createAriaLabel } from "@/utils/performance"

const AccessibleCard = React.memo(React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string;
    description?: string;
    interactive?: boolean;
  }
>(({ className, title, description, interactive = false, children, ...props }, ref) => {
  const ariaLabel = React.useMemo(() => {
    if (title && description) {
      return createAriaLabel(`${title}. ${description}`);
    }
    if (title) {
      return createAriaLabel(title);
    }
    return props['aria-label'];
  }, [title, description, props]);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        interactive && "cursor-pointer hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      role={interactive ? "button" : "region"}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  )
}))
AccessibleCard.displayName = "AccessibleCard"

const AccessibleCardHeader = React.memo(React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    role="banner"
    {...props}
  />
)))
AccessibleCardHeader.displayName = "AccessibleCardHeader"

const AccessibleCardTitle = React.memo(React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  }
>(({ className, level = 3, children, ...props }, ref) => {
  const HeadingProps = {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props,
    children
  };
  
  switch (level) {
    case 1:
      return <h1 {...HeadingProps} />;
    case 2:
      return <h2 {...HeadingProps} />;
    case 3:
      return <h3 {...HeadingProps} />;
    case 4:
      return <h4 {...HeadingProps} />;
    case 5:
      return <h5 {...HeadingProps} />;
    case 6:
      return <h6 {...HeadingProps} />;
    default:
      return <h3 {...HeadingProps} />;
  }
}))
AccessibleCardTitle.displayName = "AccessibleCardTitle"

const AccessibleCardDescription = React.memo(React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)))
AccessibleCardDescription.displayName = "AccessibleCardDescription"

const AccessibleCardContent = React.memo(React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn("p-6 pt-0", className)} 
    role="main"
    {...props} 
  />
)))
AccessibleCardContent.displayName = "AccessibleCardContent"

const AccessibleCardFooter = React.memo(React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    role="contentinfo"
    {...props}
  />
)))
AccessibleCardFooter.displayName = "AccessibleCardFooter"

export {
  AccessibleCard,
  AccessibleCardHeader,
  AccessibleCardFooter,
  AccessibleCardTitle,
  AccessibleCardDescription,
  AccessibleCardContent,
}