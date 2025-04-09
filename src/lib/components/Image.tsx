const Image = ({
  fileName,
  alt,
  className,
}: {
  fileName: string;
  alt: string;
  className?: string;
}) => {
  const cdnUrl =
    process.env.NODE_ENV === "development"
      ? import.meta.env.VITE_CDN_URL
      : process.env.VITE_CDN_URL!;
  return <img src={cdnUrl + "/" + fileName} alt={alt} className={className} />;
};

export default Image;
