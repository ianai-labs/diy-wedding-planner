export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-lg border border-transparent bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-500/20 transition-all duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2 active:bg-red-700 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
