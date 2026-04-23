function Card({ children, className = '', flash = false }) {
  return (
    <div
      className={`
        bg-dark-card border border-dark-border rounded-md p-5
        transition-all duration-300
        ${flash ? 'animate-flash-orange' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
