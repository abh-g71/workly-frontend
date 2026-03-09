function StatusBadge({ status }) {
  const getStyle = () => {
    switch (status) {
      case "OPEN":
        return { backgroundColor: "#16a34a" }; // green
      case "IN_PROGRESS":
        return { backgroundColor: "#eab308" }; // yellow
      case "COMPLETED":
        return { backgroundColor: "#3b82f6" }; // blue
      default:
        return { backgroundColor: "#6b7280" };
    }
  };

  return (
    <span
      style={{
        ...getStyle(),
        color: "white",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;