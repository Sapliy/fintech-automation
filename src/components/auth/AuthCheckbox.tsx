import { forwardRef } from 'react';

interface AuthCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: React.ReactNode;
    error?: string;
}

export const AuthCheckbox = forwardRef<HTMLInputElement, AuthCheckboxProps>(
    ({ label, error, id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1 pt-2">
                <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                        <input
                            id={id}
                            type="checkbox"
                            ref={ref}
                            className="peer sr-only"
                            {...props}
                        />
                        <div
                            className={`w-4 h-4 rounded border ${error ? 'border-destructive' : 'border-border'
                                } bg-background peer-checked:bg-primary peer-checked:border-primary transition-all`}
                        ></div>
                        <svg
                            className="absolute w-3 h-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div className="text-sm text-muted-foreground leading-snug group-hover:text-foreground transition-colors select-none">
                        {label}
                    </div>
                </label>
                {error && <span className="text-xs text-destructive pl-7">{error}</span>}
            </div>
        );
    }
);

AuthCheckbox.displayName = 'AuthCheckbox';
