export function LogoMark({ size = 36 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="58" height="58" fill="#0D0C0B" stroke="#EFE8DC" strokeWidth="3" />
      <text x="32" y="40" textAnchor="middle" fill="#EFE8DC" fontSize="20" fontFamily="Georgia, serif">
        AM
      </text>
    </svg>
  )
}

export function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 8h12l-1 13H7L6 8Z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" strokeLinecap="round" />
    </svg>
  )
}

export function IconEye() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function IconHeart({ filled = false }) {
  return (
    <svg className="icon-heart" width="22" height="22" viewBox="0 0 24 24" overflow="visible" aria-hidden="true">
      <path
        fill={filled ? '#d6ff2a' : 'none'}
        stroke="#d6ff2a"
        strokeWidth="1.85"
        strokeLinejoin="round"
        d="M12 7.2c.85-1.7 2.55-2.85 4.45-2.85 2.85 0 5.05 2.2 5.05 5.05 0 5.4-5.7 8.85-9.5 12.1C8.2 18.25 2.5 14.8 2.5 9.4c0-2.85 2.2-5.05 5.05-5.05 1.9 0 3.6 1.15 4.45 2.85Z"
      />
    </svg>
  )
}

export function IconMenu({ open }) {
  return open ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}
