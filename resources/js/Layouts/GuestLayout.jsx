import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-cream via-blush to-lavender pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gold" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden glass-strong sm:max-w-md sm:rounded-2xl px-6 py-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                {children}
            </div>
        </div>
    );
}
