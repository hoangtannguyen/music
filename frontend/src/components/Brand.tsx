import { Link } from "react-router";

export default function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Event Pro - Trang chủ">
      <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="currentColor" />
        <g fill="#fff">
          <rect x="6.5" y="16" width="3" height="8" rx="1.5" />
          <rect x="12.5" y="12" width="3" height="16" rx="1.5" />
          <rect x="18.5" y="8" width="3" height="24" rx="1.5" />
          <rect x="24.5" y="13" width="3" height="14" rx="1.5" />
          <rect x="30.5" y="17" width="3" height="6" rx="1.5" />
        </g>
      </svg>
      <span className="brand-copy"><strong>EVENT PRO</strong><small>Sound · Light · Event</small></span>
    </Link>
  );
}
