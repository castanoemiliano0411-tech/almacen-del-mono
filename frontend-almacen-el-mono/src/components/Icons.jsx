export function LogoMark({ size = 36 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#1A1612" />
      <circle cx="32" cy="28" r="12" fill="#F6F1EA" />
      <circle cx="27" cy="27" r="2" fill="#1A1612" />
      <circle cx="37" cy="27" r="2" fill="#1A1612" />
      <path d="M26 34c2.2 3 9.8 3 12 0" stroke="#1A1612" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="18" cy="24" rx="5" ry="7" fill="#F6F1EA" />
      <ellipse cx="46" cy="24" rx="5" ry="7" fill="#F6F1EA" />
      <path d="M22 44h20c0 8-4 12-10 12s-10-4-10-12Z" fill="#C45C26" />
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
