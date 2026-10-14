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

export function IconWhatsApp({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.33 4.94L2 22l5.39-1.41a10.1 10.1 0 0 0 4.65 1.12h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2Zm5.76 13.99c-.24.67-1.18 1.22-1.64 1.3-.42.07-.96.1-1.55-.1-.36-.11-.82-.27-1.42-.53-2.5-1.08-4.12-3.6-4.25-3.76-.12-.17-1.02-1.36-1.02-2.6 0-1.23.64-1.84.87-2.09.23-.25.5-.31.67-.31h.48c.15 0 .36-.06.56.43.2.5.69 1.73.75 1.86.06.13.1.28.02.45-.08.17-.12.28-.24.43l-.36.43c-.12.14-.25.29-.11.57.14.28.62 1.02 1.33 1.65.91.81 1.68 1.06 1.96 1.18.28.12.44.1.6-.06.16-.16.7-.81.88-1.09.18-.28.37-.23.62-.14.25.1 1.57.74 1.84.87.27.14.45.2.52.32.06.11.06.66-.18 1.32Z" />
    </svg>
  )
}

export function IconInstagram({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" stroke="currentColor" strokeWidth="1.85" />
      <circle cx="12" cy="12" r="4.15" stroke="currentColor" strokeWidth="1.85" />
      <circle cx="17.15" cy="6.85" r="1.15" fill="currentColor" />
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
