import Card from './Card';

const ComingSoon = ({ icon: Icon, eyebrow, title, description }) => (
  <div className="space-y-8">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">{eyebrow}</p>
      <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h1>
    </div>

    <Card className="text-center py-16">
      <div
        className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.14), rgba(139,92,246,0.14))' }}
      >
        {Icon && <Icon className="w-7 h-7 text-[#3B82F6]" />}
      </div>
      <h2 className="text-lg font-semibold text-[#F8FAFC] mb-2">Module in progress</h2>
      <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">{description}</p>
      <span
        className="inline-flex items-center gap-1.5 mt-6 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
        style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#F59E0B' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
        Coming Soon
      </span>
    </Card>
  </div>
);

export default ComingSoon;
