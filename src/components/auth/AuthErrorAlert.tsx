interface AuthErrorAlertProps {
    message: string | null;
}

export const AuthErrorAlert = ({ message }: AuthErrorAlertProps) => {
    if (!message) return null;

    return (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{message}</span>
        </div>
    );
};
