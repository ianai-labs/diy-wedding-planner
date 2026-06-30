import { Head, Link } from '@inertiajs/react';

function Sparkle({ className, style }) {
    return (
        <svg
            className={`absolute text-gold/25 ${className}`}
            style={style}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
        >
            <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
        </svg>
    );
}

function GoldLine() {
    return <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold/40 to-transparent" />;
}

function FeatureCard({ icon, label, delay }) {
    return (
        <div
            className="group glass rounded-xl p-5 text-center transition-all duration-300 hover:bg-white/60 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
        >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-rose/10 group-hover:text-rose">
                {icon}
            </div>
            <p className="font-sans text-sm font-medium text-gray-600 transition-colors group-hover:text-burgundy">
                {label}
            </p>
        </div>
    );
}

export default function Welcome({ canLogin, canRegister }) {
    const features = [
        {
            label: 'Checklist',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
        },
        {
            label: 'Budget',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: 'Vendor',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            label: 'Catatan',
            icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
        },
    ];

    return (
        <>
            <Head title="My Wedding Planner" />

            <div className="relative min-h-screen bg-gradient-to-br from-cream via-blush to-lavender flex flex-col items-center justify-center overflow-hidden px-4 py-12">
                {/* Decorative sparkles */}
                <Sparkle className="top-[8%] left-[10%] animate-float-slow" />
                <Sparkle className="top-[15%] right-[12%] animate-float-slow" style={{ animationDelay: '1.2s' }} />
                <Sparkle className="bottom-[25%] left-[8%] animate-float-slow" style={{ animationDelay: '2.4s' }} />
                <Sparkle className="bottom-[18%] right-[10%] animate-float-slow" style={{ animationDelay: '0.6s' }} />

                <div className="w-full max-w-2xl space-y-10 animate-fade-up">
                    {/* Gold line ornament */}
                    <GoldLine />

                    {/* Hero Card */}
                    <div className="glass-strong rounded-2xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] text-center">
                        <p className="font-accent italic text-gold text-lg sm:text-xl mb-2">
                            Rencanakan Hari Istimewa Anda
                        </p>

                        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-burgundy tracking-tight leading-tight mb-4">
                            My Wedding
                            <br />
                            Planner
                        </h1>

                        <p className="font-sans text-gray-600 text-base sm:text-lg max-w-md mx-auto text-balance mb-8">
                            Checklist, budget, vendor, dan catatan — semua dalam satu platform untuk
                            mewujudkan pernikahan impian Anda.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                            {canRegister && (
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center justify-center bg-rose hover:bg-rose-hover text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-rose/20 transition-all duration-300 hover:shadow-xl hover:shadow-rose/30 hover:-translate-y-0.5 w-full sm:w-auto"
                                >
                                    Mulai Rencanakan
                                </Link>
                            )}
                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="inline-flex items-center justify-center glass rounded-xl px-8 py-3.5 font-semibold text-burgundy hover:bg-white/60 transition-all duration-300 w-full sm:w-auto"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        {features.map((f, i) => (
                            <FeatureCard key={f.label} icon={f.icon} label={f.label} delay={200 + i * 100} />
                        ))}
                    </div>

                    {/* Gold line ornament */}
                    <GoldLine />

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400">
                        &copy; {new Date().getFullYear()} My Wedding Planner. Make your dream wedding come true.
                    </p>
                </div>
            </div>
        </>
    );
}
