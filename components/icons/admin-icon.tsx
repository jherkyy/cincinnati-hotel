export default function AdminIcon() {
  return (
    <svg
      className="w-16 h-16 text-primary"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Settings gear */}
      <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Gear teeth */}
      <line x1="32" y1="8" x2="32" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="62" x2="32" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="56" y1="32" x2="62" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="32" x2="8" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Diagonal teeth */}
      <line x1="46.6" y1="17.4" x2="51.4" y2="12.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12.6" y1="51.4" x2="17.4" y2="46.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="46.6" y1="46.6" x2="51.4" y2="51.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="12.6" y1="12.6" x2="17.4" y2="17.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      
      {/* Center circle */}
      <circle cx="32" cy="32" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="3" fill="currentColor" />
    </svg>
  )
}
