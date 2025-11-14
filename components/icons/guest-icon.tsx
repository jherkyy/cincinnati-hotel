export default function GuestIcon() {
  return (
    <svg
      className="w-16 h-16 text-primary"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Head */}
      <circle cx="32" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      
      {/* Body */}
      <path
        d="M24 26L20 42C20 45 24 48 32 48C40 48 44 45 44 42L40 26Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      
      {/* Arms */}
      <line x1="24" y1="30" x2="12" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="40" y1="30" x2="52" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Legs */}
      <line x1="26" y1="48" x2="26" y2="60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="38" y1="48" x2="38" y2="60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Chat bubble indicator */}
      <circle cx="48" cy="52" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M48 54L45 58L51 58Z" fill="currentColor" />
    </svg>
  )
}
