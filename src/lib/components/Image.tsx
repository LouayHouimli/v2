const Image = ({
  fileName,
  alt,
  className,
}: {
  fileName: string;
  alt: string;
  className?: string;
}) => {
  return (
    <img
      src={"https://static.cdn.zerops.app/louli.tech/" + fileName}
      alt={alt}
      className={className}
    />
  );
};

export default Image;
