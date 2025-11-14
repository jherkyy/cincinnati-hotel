export default function HotelIcon() {
  return (
    <svg
      className="w-16 h-16 text-primary"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Building outline */}
      <rect x="10" y="18" width="44" height="38" fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Roof */}
      <path d="M10 18L32 4L54 18" fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Door */}
      <rect x="28" y="38" width="8" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="47" r="1.5" fill="currentColor" />
      
      {/* Windows - Left side */}
      <rect x="14" y="24" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="14" y="34" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
      
      {/* Windows - Right side */}
      <rect x="46" y="24" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <rect x="46" y="34" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1" />
      
      {/* Accent windows - Center */}
      <rect x="24" y="24" width="5" height="5" fill="currentColor" opacity="0.6" />
      <rect x="35" y="24" width="5" height="5" fill="currentColor" opacity="0.6" />
      
      {/* Flag/antenna */}
      <line x1="32" y1="4" x2="32" y2="0" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="0" r="2" fill="currentColor" />
    </svg>
  )
}
