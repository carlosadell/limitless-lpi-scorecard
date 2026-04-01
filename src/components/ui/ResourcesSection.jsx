import { RESOURCES } from '../../data/resources';
import { Crown, Rocket, BookOpen, Phone, ExternalLink } from 'lucide-react';

const ICON_MAP = {
  crown: Crown,
  rocket: Rocket,
  book: BookOpen,
  phone: Phone,
};

export default function ResourcesSection() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {RESOURCES.map(resource => {
        const Icon = ICON_MAP[resource.icon] || Rocket;

        return (
          <a
            key={resource.id}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${resource.gradient} no-underline
                        hover:scale-[1.03] hover:shadow-xl ${resource.shadow} transition-all duration-200 cursor-pointer`}
          >
            {/* Shine overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight truncate">{resource.title}</p>
                <p className="text-[11px] text-white/70 mt-0.5 leading-tight truncate hidden sm:block">{resource.description}</p>
              </div>
              <ExternalLink size={14} className="text-white/40 group-hover:text-white/80 transition-colors flex-shrink-0" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
