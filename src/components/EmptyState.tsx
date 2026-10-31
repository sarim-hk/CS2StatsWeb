interface EmptyStateProps {
    message: string;
    className?: string;
}

function EmptyState({ message, className = "" }: EmptyStateProps) {
    return (
        <div className={`p-3 text-sm font-medium text-gray-400 ${className}`}>
            {message}
        </div>
    );
}

export default EmptyState;
