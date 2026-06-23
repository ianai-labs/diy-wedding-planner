import { Head, Link } from '@inertiajs/react';

export default function Welcome({ canLogin, canRegister }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-2xl">
                    <div className="text-6xl">💒</div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">My Wedding Planner</h1>
                    <p className="text-lg text-gray-500 max-w-lg mx-auto">
                        Rencanakan pernikahan impian Anda dengan mudah. Checklist, budget, vendor, dan catatan — semua dalam satu platform.
                    </p>
                    <div className="flex gap-4 justify-center">
                        {canLogin && (
                            <Link href={route('login')} className="rounded-md bg-white border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition">
                                Login
                            </Link>
                        )}
                        {canRegister && (
                            <Link href={route('register')} className="rounded-md bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 transition">
                                Mulai Rencanakan
                            </Link>
                        )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 text-center">
                        {[
                            { icon: '✅', label: 'Checklist' },
                            { icon: '💰', label: 'Budget' },
                            { icon: '📋', label: 'Vendor' },
                            { icon: '📝', label: 'Catatan' },
                        ].map((f) => (
                            <div key={f.label} className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="text-2xl mb-1">{f.icon}</div>
                                <p className="text-sm font-medium text-gray-600">{f.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
