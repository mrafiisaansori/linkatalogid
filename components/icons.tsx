import { cn } from "@/lib/utils";

type IconProps = {
  className?: string;
};

function base(className?: string) {
  return cn("h-5 w-5 shrink-0", className);
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.75v2.5M12 18.75v2.5M21.25 12h-2.5M5.25 12h-2.5M18.54 5.46l-1.77 1.77M7.23 16.77l-1.77 1.77M18.54 18.54l-1.77-1.77M7.23 7.23 5.46 5.46" />
    </svg>
  );
}

export function MoonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M20.5 14.25A8.5 8.5 0 0 1 9.75 3.5a8.75 8.75 0 1 0 10.75 10.75Z" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.25 4.25" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M12 3.5 14.2 9l5.3 2.2-5.3 2.3L12 19l-2.2-5.5-5.3-2.3L9.8 9 12 3.5Z" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />
    </svg>
  );
}

export function StoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M4 9.5 5.8 4h12.4L20 9.5M5 9.5h14v9.75H5zM9 13.5h6" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M4 19.25h16M7 16v-5m5 5V7m5 9v-3" />
    </svg>
  );
}

export function ActivityIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M3 12h4l2.25-4.5L13 16l2.5-5H21" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M12 2.75 19.25 5v5.85c0 4.44-2.91 8.45-7.25 10.4-4.34-1.95-7.25-5.96-7.25-10.4V5L12 2.75Z" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M16.5 19.25c.47-2.31 2.13-3.75 4.5-4.25M7.5 19.25C7.03 16.94 5.37 15.5 3 15M8.75 11a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5Zm6.5 1.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM12 20.25c1.12-3.17 3.3-4.75 6.5-4.75" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M12 8.75A3.25 3.25 0 1 0 12 15.25 3.25 3.25 0 0 0 12 8.75Z" />
      <path d="m4.5 13.5 1.4.24a6.9 6.9 0 0 0 .66 1.58l-.84 1.15 1.77 1.77 1.15-.84c.5.29 1.03.51 1.58.66l.24 1.4h2.5l.24-1.4a6.9 6.9 0 0 0 1.58-.66l1.15.84 1.77-1.77-.84-1.15c.29-.5.51-1.03.66-1.58l1.4-.24V11l-1.4-.24a6.9 6.9 0 0 0-.66-1.58l.84-1.15-1.77-1.77-1.15.84a6.9 6.9 0 0 0-1.58-.66l-.24-1.4h-2.5l-.24 1.4a6.9 6.9 0 0 0-1.58.66l-1.15-.84-1.77 1.77.84 1.15a6.9 6.9 0 0 0-.66 1.58L4.5 11v2.5Z" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M9 4.75H6.75A1.75 1.75 0 0 0 5 6.5v11a1.75 1.75 0 0 0 1.75 1.75H9M14 16.25 19.25 12 14 7.75M10 12h9.25" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <rect x="5" y="10.25" width="14" height="10" rx="2" />
      <path d="M8 10.25V8a4 4 0 1 1 8 0v2.25" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.75 12h16.5M12 3.25c2.33 2.5 3.5 5.42 3.5 8.75s-1.17 6.25-3.5 8.75M12 3.25c-2.33 2.5-3.5 5.42-3.5 8.75s1.17 6.25 3.5 8.75" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.25l3.25 1.75" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={base(className)}>
      <path d="M19.5 4.5A9.95 9.95 0 0 0 12 1.25C6.2 1.25 1.5 5.95 1.5 11.75c0 1.85.48 3.65 1.4 5.24L1.25 22.75l5.92-1.55a10.52 10.52 0 0 0 4.83 1.22c5.8 0 10.5-4.7 10.5-10.5 0-2.81-1.1-5.46-3-7.42Zm-7.5 16.17c-1.5 0-2.96-.4-4.25-1.14l-.3-.17-3.52.92.94-3.43-.2-.35a8.65 8.65 0 0 1-1.33-4.59 8.68 8.68 0 0 1 8.66-8.66c2.31 0 4.49.9 6.13 2.54a8.62 8.62 0 0 1 2.53 6.12 8.68 8.68 0 0 1-8.66 8.76Zm4.75-6.47c-.26-.13-1.53-.75-1.77-.84-.24-.09-.42-.13-.59.13-.17.26-.67.84-.82 1.01-.15.18-.3.2-.55.07-.26-.13-1.08-.4-2.07-1.29-.77-.68-1.29-1.52-1.44-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.31.39-.46.13-.15.17-.26.26-.44.09-.17.05-.33-.02-.46-.07-.13-.59-1.43-.81-1.95-.21-.51-.42-.44-.59-.45l-.5-.01c-.17 0-.46.07-.7.33-.24.26-.92.9-.92 2.18s.94 2.53 1.07 2.7c.13.18 1.84 2.81 4.46 3.94.62.27 1.1.43 1.47.55.62.2 1.18.17 1.62.1.5-.07 1.53-.62 1.75-1.22.22-.6.22-1.11.15-1.22-.07-.11-.24-.17-.5-.3Z" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5ZM4 20.25c1.07-3.27 4-5 8-5s6.93 1.73 8 5" />
    </svg>
  );
}

export function BoxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="m12 2.75 8 4.5v9l-8 5-8-5v-9l8-4.5ZM12 7.25l8-4.5M12 7.25l-8-4.5M12 21.25v-14" />
    </svg>
  );
}

export function LocationIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M12 21.25s6-6 6-11.25a6 6 0 1 0-12 0c0 5.25 6 11.25 6 11.25Z" />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M4 7.75h3.25L9 5.25h6l1.75 2.5H20a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function CopyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M9 9.25h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1ZM5 15.25H4a1 1 0 0 1-1-1v-10a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M1.75 12s3.5-6.25 10.25-6.25S22.25 12 22.25 12 18.75 18.25 12 18.25 1.75 12 1.75 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="m4 20 4.25-1 9.82-9.82a1.5 1.5 0 0 0 0-2.12l-1.13-1.13a1.5 1.5 0 0 0-2.12 0L5 15.75 4 20Z" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M4.75 7.75h14.5M9 7.75V5.5A1.75 1.75 0 0 1 10.75 3.75h2.5A1.75 1.75 0 0 1 15 5.5v2.25m-8.5 0 1 11a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9l1-11" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={base(className)}>
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <path d="M2.75 3.75h1.5l2 9.5h10.5l2-7H6.5" />
      <circle cx="9.5" cy="18.5" r="1.25" />
      <circle cx="16.5" cy="18.5" r="1.25" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={base(className)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={base(className)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base(className)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={base(className)}>
      <path d="M16.5 3c.31 1.92 1.47 3.36 3.5 3.62v2.45c-1.18.05-2.27-.27-3.3-.86v5.45c0 3.46-2.6 5.79-5.6 5.79-2.5 0-4.6-1.78-4.6-4.45 0-2.85 2.36-4.66 5.27-4.18v2.6c-.32-.1-.7-.16-1.1-.16-1.1 0-1.93.78-1.93 1.85 0 1.1.85 1.85 1.9 1.85 1.27 0 2.16-.97 2.16-2.55V3h3.2Z" />
    </svg>
  );
}
