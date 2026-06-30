import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/utils/format';

const userNavItems = [
    { name: 'Dashboard', route: 'dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Vendor List', route: 'vendors.index', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Budget', route: 'budgets.index', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Checklist', route: 'tasks.index', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Catatan', route: 'notes.index', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Pesan', route: 'messages.index', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { name: 'Laporan', route: 'reports.index', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user?.role === 'admin';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-cream">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col">
                <div className="flex flex-col flex-grow glass border-r border-white/30 pt-5 pb-4 overflow-y-auto">
                    <div className="flex items-center shrink-0 px-4">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-burgundy" />
                        </Link>
                        <span className="ml-2 text-lg font-semibold text-burgundy">Wedding Planner</span>
                    </div>
                    <nav className="mt-8 flex-1 flex flex-col space-y-1 px-3">
                        {isAdmin ? (
                            <>
                                <NavLink href={route('admin.index')} active={route().current('admin.index')}>
                                    <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={userNavItems.find(i => i.route === 'dashboard').icon} />
                                    </svg>
                                    Admin Dashboard
                                </NavLink>
                                <NavLink href={route('admin.vendors.index')} active={route().current('admin.vendors.*')}>
                                    <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Kelola Vendor
                                </NavLink>
                                <NavLink href={route('admin.chats')} active={route().current('admin.chats')}>
                                    <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Chat Support
                                </NavLink>
                            </>
                        ) : (
                            userNavItems.map((item) => (
                                <NavLink key={item.route} href={route(item.route)} active={route().current(item.route + '*') || route().current(item.route)}>
                                    <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                    {item.name}
                                </NavLink>
                            ))
                        )}
                    </nav>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top header */}
                <header className="bg-cream/80 backdrop-blur-md border-b border-gray-100">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            className="lg:hidden -ml-0.5 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-rose/5 focus:outline-none"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>

                        <div className="flex-1" />

                        {/* User dropdown */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 hidden sm:block">
                                {user.wedding_date && (
                                    <>Pernikahan: {formatDate(user.wedding_date)}</>
                                )}
                            </span>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2">
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full bg-rose/10 flex items-center justify-center">
                                            <span className="text-sm font-medium text-rose">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="hidden md:block text-sm font-medium text-gray-800">{user.name}</span>
                                        <svg className="hidden md:block h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mobile sidebar */}
                    {sidebarOpen && (
                        <div className="lg:hidden border-t border-white/30 glass">
                            <nav className="space-y-1 px-3 pb-3 pt-2">
                                {isAdmin ? (
                                    <>
                                        <NavLink href={route('admin.index')} active={route().current('admin.index')}>
                                            <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={userNavItems.find(i => i.route === 'dashboard').icon} />
                                            </svg>
                                            Admin Dashboard
                                        </NavLink>
                                        <NavLink href={route('admin.vendors.index')} active={route().current('admin.vendors.*')}>
                                            <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            Kelola Vendor
                                        </NavLink>
                                        <NavLink href={route('admin.chats')} active={route().current('admin.chats')}>
                                            <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            Chat Support
                                        </NavLink>
                                    </>
                                ) : (
                                    userNavItems.map((item) => (
                                        <NavLink key={item.route} href={route(item.route)} active={route().current(item.route + '*') || route().current(item.route)}>
                                            <svg className="mr-3 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                            </svg>
                                            {item.name}
                                        </NavLink>
                                    ))
                                )}
                            </nav>
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
