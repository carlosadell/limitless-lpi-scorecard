export default function Footer() {
  return (
    <footer className="w-full py-5 mt-8 border-t border-white/[0.03] text-center">
      <a
        href="https://aiconichub.ai/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] text-brand-gray/40 hover:text-brand-gray/70 transition-colors duration-200"
      >
        Powered by{' '}
        <span className="font-semibold">
          <span className="text-red-500/70">A.I.</span>
          <span className="text-white/50">conic</span>
        </span>
      </a>
    </footer>
  );
}
