import { RESOURCES } from '../../data/resources';
import { Crown, Rocket, BookOpen, Phone, GraduationCap, Users, ExternalLink } from 'lucide-react';

const ICON_MAP = {
  crown: Crown,
  rocket: Rocket,
  book: BookOpen,
  phone: Phone,
  graduation: GraduationCap,
  users: Users,
};

const COLOR_MAP = {
  red: {
    pill: 'bg-gradient-to-r from-red-500/20 to-red-600/10',
    border: 'border-red-500/30',
    iconBg: 'bg-red-500/20',
    text: 'text-red-400',
    hoverBorder: 'hover:border-red-500/60',
    hoverShadow: 'hover:shadow-red-500/10',
    glow: 'group-hover:text-red-300',
  },
  blue: {
    pill: 'bg-gradient-to-r from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/20',
    text: 'text-blue-400',
    hoverBorder: 'hover:border-blue-500/60',
    hoverShadow: 'hover:shadow-blue-500/10',
    glow: 'group-hover:text-blue-300',
  },
  green: {
    pill: 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/60',
    hoverShadow: 'hover:shadow-emerald-500/10',
    glow: 'group-hover:text-emerald-300',
  },
};

export default function ResourcesSection({ compact }) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 animate-fade-in">
        {RESOURCES.map(resource => {
          const Icon = ICON_MAP[resource.icon] || Rocket;
          const colors = COLOR_MAP[resource.color] || COLOR_MAP.red;

          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-xl p-3 border ${colors.border} ${colors.hoverBorder} ${colors.pill} transition-all duration-200 no-underline flex flex-col items-center text-center gap-2 hover:shadow-lg ${colors.hoverShadow} hover:-translate-y-0.5`}
            >
              <div className={`w-8 h-8 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
                <Icon size={15} className={`${colors.text} ${colors.glow} transition-colors`} />
              </div>
              <p className={`text-[11px] font-bold text-white leading-tight ${colors.glow} transition-colors`}>
                {resource.title}
              </p>
              <ExternalLink size={10} className="absolute top-2 right-2 text-brand-gray opacity-0 group-hover:opacity-60 transition-opacity" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
          <Rocket size={18} className="text-brand-red" />
        </div>
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">Resources & Tools</h3>
          <p className="text-xs text-brand-gray">Level up your practice</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RESOURCES.map(resource => {
          const Icon = ICON_MAP[resource.icon] || Rocket;
          const colors = COLOR_MAP[resource.color] || COLOR_MAP.red;

          return (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-brand-card rounded-xl p-4 border ${colors.border} ${colors.hoverBorder} transition-all duration-200 group flex items-start gap-3.5 no-underline hover:shadow-lg ${colors.hoverShadow}`}
            >
              <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={colors.text} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-white group-hover:text-brand-red transition-colors">{resource.title}</p>
                  <ExternalLink size={12} className="text-brand-gray opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                <p className="text-xs text-brand-gray mt-1 leading-relaxed">{resource.description}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
