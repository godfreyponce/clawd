/** A little device-screen frame: dark bezel around the orange face canvas. */
export default function Screen({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] bg-[#0c0c0e] p-1.5 shadow-[0_10px_30px_rgba(80,50,25,0.16)] ${className}`}
    >
      <div className="overflow-hidden rounded-[14px] leading-none">{children}</div>
    </div>
  );
}
