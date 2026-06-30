export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer ring — elegant thin circle */}
            <circle
                cx="40" cy="40" r="36"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeOpacity="0.3"
            />
            {/* Inner accent ring */}
            <circle
                cx="40" cy="40" r="30"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeOpacity="0.12"
            />
            {/* Elegant geometric W — two overlapping chevrons */}
            <path
                d="M18 26l10 22 12-16 12 16 10-22"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Small diamond accent */}
            <path
                d="M40 58l3-5h-6l3 5z"
                fill="currentColor"
                fillOpacity="0.45"
            />
        </svg>
    );
}
