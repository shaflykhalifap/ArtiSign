type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const Image = ({ src, alt, className = "" }: ImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-contain ${className}`}
      loading="lazy"
    />
  );
};

export default Image;
