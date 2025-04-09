const Image = ({
  fileName,
  alt,
  className,
}: {
  fileName: string;
  alt: string;
  className?: string;
}) => {
  const cdnUrl = import.meta.env.VITE_CDN_URL;
  console.log(cdnUrl);
  return <img src={cdnUrl + "/" + fileName} alt={alt} className={className} />;
};

export default Image;
