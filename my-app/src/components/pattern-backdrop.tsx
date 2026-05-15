type PatternBackdropProps = {
  className?: string;
  tone?: 'light' | 'dark';
};

const lightPattern =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"%3E%3Ccircle cx="4" cy="4" r="1.5" fill="%239ca3af" fill-opacity="0.25"/%3E%3Ccircle cx="28" cy="16" r="1.5" fill="%239ca3af" fill-opacity="0.2"/%3E%3Ccircle cx="16" cy="32" r="1.5" fill="%239ca3af" fill-opacity="0.15"/%3E%3Ccircle cx="40" cy="40" r="1.5" fill="%239ca3af" fill-opacity="0.18"/%3E%3C/svg%3E';

// const darkPattern =
//   'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"%3E%3Ccircle cx="4" cy="4" r="1.5" fill="%23c4b5fd" fill-opacity="0.18"/%3E%3Ccircle cx="28" cy="16" r="1.5" fill="%23c4b5fd" fill-opacity="0.12"/%3E%3Ccircle cx="16" cy="32" r="1.5" fill="%23c4b5fd" fill-opacity="0.1"/%3E%3Ccircle cx="40" cy="40" r="1.5" fill="%23c4b5fd" fill-opacity="0.14"/%3E%3C/svg%3E';

const PatternBackdrop = ({ className = '' }: PatternBackdropProps) => {
  const pattern = lightPattern;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url("${pattern}")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
};

export default PatternBackdrop;
