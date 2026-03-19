export default function Footer() {
  return (
    <footer className="w-full py-4 mt-8 border-t border-brand-border text-center">
      <a
        href="https://aiconichub.ai/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-white transition-colors"
      >
        Powered by{' '}
        <span className="font-semibold">
          <span className="text-red-500">A.I.</span>
          <span className="text-white">conic</span>
        </span>
      </a>
    </footer>
  );
}
