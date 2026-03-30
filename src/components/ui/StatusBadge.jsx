import { STATUS_COLORS } from '../../data/kpiDefinitions';
import { CheckCircle2, AlertCircle, AlertTriangle, CircleDashed } from 'lucide-react';

const STATUS_ICONS = {
  green: CheckCircle2,
  yellow: AlertCircle,
  red: AlertTriangle,
  none: CircleDashed,
};

export default function StatusBadge({ status, size = 'sm' }) {
  const color = STATUS_COLORS[status] || STATUS_COLORS.none;
  const Icon = STATUS_ICONS[status] || STATUS_ICONS.none;
  const sizeClasses = size === 'lg' ? 'px-3 py-1.5 text-[11px] gap-1.5' : 'px-2 py-0.5 text-[10px] gap-1';
  const iconSize = size === 'lg' ? 13 : 10;

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${sizeClasses}`}
      style={{
        backgroundColor: `${color.bg}20`,
        color: color.bg,
        border: `1px solid ${color.bg}40`,
      }}
    >
      <Icon size={iconSize} strokeWidth={2.5} />
      {color.label}
    </span>
  );
}
