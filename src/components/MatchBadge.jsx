function MatchBadge({ percentage }) {
  const getColor = () => {
    if (percentage >= 70) return "#16a34a";   // green
    if (percentage >= 40) return "#eab308";   // yellow
    return "#ef4444";                         // red
  };

  return (
    <span
      style={{
        backgroundColor: getColor(),
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {percentage}% Match
    </span>
  );
}

export default MatchBadge;