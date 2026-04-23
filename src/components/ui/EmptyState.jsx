import Button from './Button';

function EmptyState({ icon = '📭', title = 'Nothing here', description = '', actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <span className="text-6xl mb-4">{icon}</span>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-txt-secondary text-center max-w-xs mb-4">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
