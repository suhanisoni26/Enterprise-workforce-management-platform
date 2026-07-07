export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
    <div>
      <h3 className="text-base font-semibold text-black tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

const Card = ({ children, className = '', noPadding = false }) => (
  <div className={`card ${className}`}>
    <div className={noPadding ? '' : 'p-4 sm:p-5'}>
      {children}
    </div>
  </div>
);

export default Card;
