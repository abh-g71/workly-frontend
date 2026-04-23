function StatusBadge({ status }) {
  const getStyle = () => {
    switch (status) {
      case "OPEN":
        return 'bg-green-500/10 text-green-400 border border-green-500/30';
      case "IN_PROGRESS":
        return 'bg-orange-bg text-orange-primary border border-orange-border';
      case "COMPLETED":
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      default:
        return 'bg-dark-border text-txt-secondary';
    }
  };

  const getIcon = () => {
    switch (status) {
      case "OPEN": return "●";
      case "IN_PROGRESS": return "◐";
      case "COMPLETED": return "✓";
      default: return "○";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "IN_PROGRESS": return "In Progress";
      default: return status?.charAt(0) + status?.slice(1).toLowerCase();
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStyle()}`}>
      <span className="text-[10px]">{getIcon()}</span>
      {getLabel()}
    </span>
  );
}

export default StatusBadge;