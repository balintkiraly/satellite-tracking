export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-gradient-to-tr from-blue-400/5 via-teal-400/5 to-green-400/5 p-1 rounded-lg backdrop-blur-lg border border-white/20 shadow-lg ${className || ''}`}>
      {children}
    </div>
  );
}