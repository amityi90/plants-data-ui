import { Link } from 'react-router-dom';

export default function LeafLogo() {
  return (
    <Link to="/" className="flex items-center gap-2 no-underline">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M18 3C10 3 4 12 4 20c0 6 4 10 9 11 0-5 2-10 5-14-1 4-1 9 1 14 5-1 9-5 9-11 0-8-6-17-10-17z"
          fill="#2d6a4f"
        />
        <path
          d="M18 17c0 5-1 10-2 15"
          stroke="#1b4332"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="text-xl leading-none"
        style={{ fontFamily: "'Playfair Display', serif", color: '#1b4332', fontWeight: 600 }}
      >
        Plants Data
      </span>
    </Link>
  );
}
