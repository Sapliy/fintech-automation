interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    children: React.ReactNode;
}

export const AuthButton = ({ isLoading, children, ...props }: AuthButtonProps) => {
    return (
        <button
            {...props}
            disabled={isLoading || props.disabled}
            className={`w-full py-3.5 px-4 mt-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-bold tracking-wide hover:from-cyan-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 active:translate-y-0 ${props.className || ''
                }`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : (
                children
            )}
        </button>
    );
};
