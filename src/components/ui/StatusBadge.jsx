import { STATUS_COLORS } from '../../data/kpiDefinitions';

export default function StatusBadge({ status, size = 'sm' }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.none;
  const sizeClasses = size === 'lg' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold uppercase tracking-wider ${sizeClasses}`}
      style={{
        backgroundColor: `${color.bg}20`,
        color: color.bg,
        border: `1px solid ${color.bg}40`,
      }}
    >
      <span
        className={`inline-block rounded-full ${size === 'lg' ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}
        style={{ backgroundColor: color.bg }}
      />
      {color.label}
    </span>
  );
}
