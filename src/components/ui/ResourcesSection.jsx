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
    bg: 'bg-brand-red/10',
    border: 'border-brand-red/25',
    text: 'text-brand-red',
    hover: 'hover:border-brand-red/50',
  },
  blue: {
    bg: 'bg-brand-blue/10',
    border: 'border-brand-blue/25',
    text: 'text-brand-blue',
    hover: 'hover:border-brand-blue/50',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/25',
    text: 'text-green-400',
    hover: 'hover:border-green-500/50',
  },
};

export default function ResourcesSection() {
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
              className={`bg-brand-card rounded-xl p-4 border ${colors.border} ${colors.hover} transition-all duration-200 group flex items-start gap-3.5 no-underline`}
            >
              <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
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
