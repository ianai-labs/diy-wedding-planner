export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-rose px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-rose/20 transition-all duration-200 hover:bg-rose-hover focus:outline-none focus:ring-2 focus:ring-rose/30 focus:ring-offset-2 active:bg-rose-hover ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
