import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { formatDate, formatRp } from '@/utils/format';

export default function AdminPlan({ targetUser, tasks, budgets, notes, messages, totalSpent, taskProgress, budgetPercent }) {
    const [tab, setTab] = useState('dashboard');
    const { data, setData, post, processing, reset } = useForm({ message: '' });
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const submitChat = (e) => {
        e.preventDefault();
        post(route('admin.messages.store', targetUser.id), { onSuccess: () => reset() });
    };

    const tabs = [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'tasks', label: `Tasks (${tasks.length})` },
        { key: 'budgets', label: `Budget (${budgets.length})` },
        { key: 'notes', label: `Notes (${notes.length})` },
        { key: 'chat', label: 'Chat' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={`Kelola: ${targetUser.name}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-burgundy">{targetUser.name}</h2>
                        <p className="text-sm text-gray-600">{targetUser.email} · {targetUser.partner_name && `Pasangan: ${targetUser.partner_name}`} · Pernikahan: {formatDate(targetUser.wedding_date)} · Budget: Rp {formatRp(targetUser.total_budget)}</p>
                    </div>
                    <Link href={route('admin.index')} className="text-sm text-rose hover:underline">← Kembali</Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200">
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${tab === t.key ? 'border-rose text-rose' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Dashboard */}
                {tab === 'dashboard' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Total Budget</p><p className="text-xl font-bold">Rp {formatRp(targetUser.total_budget)}</p></div>
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Spent</p><p className="text-xl font-bold text-red-600">Rp {formatRp(totalSpent)}</p></div>
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Task Progress</p><p className="text-xl font-bold text-blue-600">{taskProgress}%</p></div>
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Budget Progress</p><p className="text-xl font-bold text-rose">{budgetPercent}%</p></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                                <h3 className="text-sm font-semibold mb-3">Task Terbaru</h3>
                                {tasks.length === 0 ? <p className="text-xs text-gray-400">Belum ada task.</p> : (
                                    <ul className="space-y-2">{tasks.slice(0, 8).map(t => (
                                        <li key={t.id} className="flex justify-between text-sm border-b pb-1">
                                            <span>{t.title}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'completed' ? 'bg-green-100 text-green-700' : t.status === 'progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span>
                                        </li>
                                    ))}</ul>
                                )}
                            </div>
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                                <h3 className="text-sm font-semibold mb-3">Budget Terbaru</h3>
                                {budgets.length === 0 ? <p className="text-xs text-gray-400">Belum ada budget.</p> : (
                                    <ul className="space-y-2">{budgets.slice(0, 8).map(b => (
                                        <li key={b.id} className="flex justify-between text-sm border-b pb-1">
                                            <span>{b.description}</span>
                                            <span className="font-medium">Rp {formatRp(b.amount)}</span>
                                        </li>
                                    ))}</ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Tasks */}
                {tab === 'tasks' && (
                    <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-cream/50"><tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Judul</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Kategori</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Deadline</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Prioritas</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-200">
                                {tasks.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Belum ada task.</td></tr>
                                    : tasks.map(t => (
                                        <tr key={t.id}>
                                            <td className="px-3 py-2 font-medium">{t.title}</td>
                                            <td className="px-3 py-2">{t.category}</td>
                                            <td className="px-3 py-2">{formatDate(t.deadline)}</td>
                                            <td className="px-3 py-2 capitalize">{t.priority}</td>
                                            <td className="px-3 py-2 capitalize">{t.status}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab: Budgets */}
                {tab === 'budgets' && (
                    <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-cream/50"><tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Deskripsi</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Kategori</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Jumlah</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Tanggal</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                            </tr></thead>
                            <tbody className="divide-y divide-gray-200">
                                {budgets.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Belum ada budget.</td></tr>
                                    : budgets.map(b => (
                                        <tr key={b.id}>
                                            <td className="px-3 py-2 font-medium">{b.description}</td>
                                            <td className="px-3 py-2">{b.category}</td>
                                            <td className="px-3 py-2">Rp {formatRp(b.amount)}</td>
                                            <td className="px-3 py-2">{formatDate(b.date)}</td>
                                            <td className="px-3 py-2 capitalize">{b.status}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Tab: Notes */}
                {tab === 'notes' && (
                    <div>
                        {notes.length === 0 ? <p className="text-center text-gray-400 py-12">Belum ada catatan.</p> : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {notes.map(n => (
                                    <div key={n.id} className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-4 space-y-2">
                                        <h3 className="font-semibold text-burgundy">{n.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-4">{n.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Chat */}
                {tab === 'chat' && (
                    <div className="flex flex-col h-[500px]">
                        <div className="flex-1 overflow-y-auto rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-4 space-y-3 mb-3">
                            {messages.length === 0 ? (
                                <p className="text-center text-gray-400 py-12">Belum ada pesan dari user ini.</p>
                            ) : messages.map((m) => (
                                <div key={m.id} className={`flex ${m.is_from_admin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-lg px-4 py-2 ${m.is_from_admin ? 'bg-rose text-white' : 'bg-gray-100 text-gray-800'}`}>
                                        <p className="text-sm">{m.message}</p>
                                        <p className={`text-xs mt-1 ${m.is_from_admin ? 'text-rose/60' : 'text-gray-400'}`}>
                                            {new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                        <form onSubmit={submitChat} className="flex gap-2">
                            <input type="text" value={data.message} onChange={e => setData('message', e.target.value)}
                                placeholder="Balas pesan..." className="flex-1 rounded-md border-gray-300 shadow-sm" required />
                            <button type="submit" disabled={processing}
                                className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover disabled:opacity-50">Kirim</button>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
