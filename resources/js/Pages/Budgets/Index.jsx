import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate, formatRp } from '@/utils/format';

const categoryLabels = { venue: 'Venue', catering: 'Catering', decoration: 'Dekorasi', photo_video: 'Foto/Video', dress: 'Busana', ring: 'Cincin', others: 'Lainnya' };
const taskCategories = ['H-365', 'H-180', 'H-90', 'H-30', 'H-7'];
const getDefaultTaskCategory = (budgetCat) => {
    switch (budgetCat) {
        case 'venue': case 'others': return 'H-365';
        case 'photo_video': case 'dress': return 'H-180';
        case 'catering': case 'decoration': case 'ring': return 'H-90';
        default: return 'H-365';
    }
};

export default function BudgetsIndex({ budgets, totalBudget, totalSpent, totalPlanned, remaining, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [month, setMonth] = useState(filters.month || '');
// Add-to-task modal state
    const [taskModal, setTaskModal] = useState(null); // { id, description, category }
    const { data: taskData, setData: setTaskData, post: postTask, processing: taskProcessing, errors: taskErrors, reset: resetTask } = useForm({
        title: '', category: 'H-365', priority: 'medium', deadline: '',
    });

    const openTaskModal = (b) => {
        setTaskData({
            title: b.description,
            category: getDefaultTaskCategory(b.category),
            priority: 'medium',
            deadline: '',
        });
        setTaskModal(b);
    };

    const submitTask = (e) => {
        e.preventDefault();
        postTask(route('budgets.add-to-task', taskModal.id), {
            onSuccess: () => { setTaskModal(null); resetTask(); },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Budget" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Budget Tracker</h2>
                    <Link href={route('budgets.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">+ Tambah</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-lg bg-white p-4 shadow"><p className="text-xs text-gray-500">Total Budget</p><p className="text-lg font-bold">Rp {formatRp(totalBudget)}</p></div>
                    <div className="rounded-lg bg-white p-4 shadow"><p className="text-xs text-gray-500">Terpakai (Spent)</p><p className="text-lg font-bold text-red-600">Rp {formatRp(totalSpent)}</p></div>
                    <div className="rounded-lg bg-white p-4 shadow"><p className="text-xs text-gray-500">Rencana (Planned)</p><p className="text-lg font-bold text-blue-600">Rp {formatRp(totalPlanned)}</p></div>
                    <div className="rounded-lg bg-white p-4 shadow"><p className="text-xs text-gray-500">Sisa</p><p className={`text-lg font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>Rp {formatRp(remaining)}</p></div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow">
                    <div className="w-full bg-gray-200 rounded-full h-3 flex">
                        <div className="bg-red-500 h-3 rounded-l-full" style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }} />
                        <div className="bg-blue-400 h-3" style={{ width: `${totalBudget > 0 ? Math.min((totalPlanned / totalBudget) * 100, 100) : 0}%` }} />
                        <div className="flex-1" />
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>🔴 Spent {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
                        <span>🔵 Planned {totalBudget > 0 ? Math.round((totalPlanned / totalBudget) * 100) : 0}%</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari..." className="rounded-md border-gray-300 text-sm" />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border-gray-300 text-sm">
                        <option value="">Semua Kategori</option>
                        {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-md border-gray-300 text-sm" />
                    <button onClick={() => router.get(route('budgets.index'), { search, category, month }, { preserveState: true, replace: true })} className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500">Filter</button>
                </div>
                {flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>}
                <div className="rounded-lg bg-white shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Add to Task</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th></tr></thead>
                        <tbody className="divide-y divide-gray-200">
                            {budgets.data.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Belum ada data budget.</td></tr>
                                : budgets.data.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3"><Link href={route('budgets.show', b.id)} className="text-sm font-medium text-indigo-600 hover:underline">{b.description}</Link></td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{categoryLabels[b.category] || b.category}</td>
                                        <td className="px-4 py-3 text-sm font-medium">Rp {formatRp(b.amount)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(b.date)}</td>
                                        <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${b.status === 'spent' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{b.status === 'spent' ? 'Spent' : 'Planned'}</span></td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => openTaskModal(b)} className="text-green-600 hover:text-green-800 text-xs font-medium" title="Add to Checklist">+ Checklist</button>
                                        </td>
                                        <td className="px-4 py-3 text-sm space-x-1">
                                            <Link href={route('budgets.edit', b.id)} className="text-indigo-600 hover:underline">Edit</Link>
                                            <Link href={route('budgets.destroy', b.id)} method="delete" as="button" className="text-red-600 hover:underline" onClick={(e) => { if (!confirm('Hapus?')) e.preventDefault(); }}>Hapus</Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add to Task Modal */}
            {taskModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Tambah ke Checklist</h3>
                        <p className="text-xs text-gray-500">Dari budget: <strong>{taskModal.description}</strong> (Rp {formatRp(taskModal.amount)})</p>
                        <form onSubmit={submitTask} className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Judul Task</label>
                                <input type="text" value={taskData.title} onChange={e => setTaskData('title', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                {taskErrors.title && <p className="mt-1 text-xs text-red-600">{taskErrors.title}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                    <select value={taskData.category} onChange={e => setTaskData('category', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        {taskCategories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                                    <select value={taskData.priority} onChange={e => setTaskData('priority', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deadline</label>
                                <input type="date" value={taskData.deadline} onChange={e => setTaskData('deadline', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => { setTaskModal(null); resetTask(); }}
                                    className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Batal</button>
                                <button type="submit" disabled={taskProcessing}
                                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50">Simpan ke Checklist</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
