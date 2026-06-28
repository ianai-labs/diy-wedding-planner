import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate, formatRp } from '@/utils/format';

const getCountdownStyle = (days) => {
    if (days === null) return '';
    if (days < 0) return 'text-gray-400';
    if (days <= 7) return 'text-red-600 font-bold';
    if (days <= 30) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
};
const countdownLabel = (days) => {
    if (days === null) return '-';
    if (days < 0) return 'Lewat';
    return `H-${days}`;
};

export default function AdminIndex({ users, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilter = () => router.get(route('admin.index'), { search, date_from: dateFrom, date_to: dateTo }, { preserveState: true, replace: true });

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Admin</h2>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'Total User', v: stats.totalUsers, c: 'text-indigo-600' },
                        { label: 'Total Task', v: stats.totalTasks, c: 'text-blue-600' },
                    ].map(s => (
                        <div key={s.label} className="rounded-lg bg-white p-4 shadow text-center">
                            <p className={`text-xl font-bold ${s.c}`}>{s.v}</p>
                            <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search & filter */}
                <div className="flex flex-wrap gap-3 items-end rounded-lg bg-white p-4 shadow">
                    <div><label className="text-xs text-gray-500">Cari</label><input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nama/email..." className="mt-1 block rounded-md border-gray-300 text-sm w-48" /></div>
                    <div><label className="text-xs text-gray-500">Nikah Dari</label><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="mt-1 block rounded-md border-gray-300 text-sm" /></div>
                    <div><label className="text-xs text-gray-500">Sampai</label><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="mt-1 block rounded-md border-gray-300 text-sm" /></div>
                    <button onClick={applyFilter} className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500 h-9">Filter</button>
                    <button onClick={() => { setSearch(''); setDateFrom(''); setDateTo(''); router.get(route('admin.index'), {}, { preserveState: true, replace: true }); }} className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-300 h-9">Reset</button>
                </div>

                {/* Export section */}
                <div className="flex flex-wrap gap-3 items-center rounded-lg bg-white p-4 shadow">
                    <span className="text-sm font-medium text-gray-700">Export Data User:</span>
                    <a href={route('admin.export-pdf')} className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition">📄 Export PDF</a>
                    <a href={route('admin.export-csv')} className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition">📊 Export CSV</a>
                </div>

                {/* Users table — di ATAS */}
                <div className="rounded-lg bg-white shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50"><tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pernikahan</th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Countdown</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Task</th>
                            <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.data.length === 0 ? <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">Tidak ada data user.</td></tr>
                                : users.data.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-3"><p className="font-medium text-gray-800">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></td>
                                        <td className="px-3 py-3">{formatDate(u.wedding_date)}</td>
                                        <td className={`px-3 py-3 text-center font-medium ${getCountdownStyle(u.days_left)}`}>{countdownLabel(u.days_left)}</td>
                                        <td className="px-3 py-3">Rp {formatRp(u.total_budget)}</td>
                                        <td className="px-3 py-3 text-red-600">Rp {formatRp(u.total_spent)}</td>
                                        <td className="px-3 py-3 text-center">{u.completed_tasks}/{u.tasks_count}</td>
                                        <td className="px-3 py-3 space-x-2">
                                            <Link href={route('admin.users.manage', u.id)} className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">Kelola Plan</Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links && (
                    <div className="flex justify-center gap-1">
                        {users.links.map((l, i) => (
                            <Link key={i} href={l.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded ${l.active ? 'bg-indigo-600 text-white' : l.url ? 'bg-white text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-default'}`}
                                dangerouslySetInnerHTML={{ __html: l.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
