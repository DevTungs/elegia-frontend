import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "auto" : "async"}
      className={cn("will-change-auto", className)}
      {...props}
    />
  );
}

export default OptimizedImage;
