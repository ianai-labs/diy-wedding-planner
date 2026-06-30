import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { formatDate, formatRp } from '@/utils/format';

const taskCategories = ['H-365', 'H-180', 'H-90', 'H-30', 'H-7'];
const budgetCategories = ['venue', 'catering', 'decoration', 'photo_video', 'dress', 'ring', 'others'];

export default function AdminManage({ targetUser, tasks, budgets, notes, messages, totalSpent, taskProgress, budgetPercent }) {
    const [tab, setTab] = useState('dashboard');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    // Task form
    const taskForm = useForm({ title: '', category: 'H-365', priority: 'medium', deadline: '', status: 'pending' });
    // Budget form
    const budgetForm = useForm({ description: '', category: 'venue', amount: '', date: '', status: 'planned' });
    // Note form
    const noteForm = useForm({ title: '', content: '' });
    // Chat form
    const chatForm = useForm({ message: '' });

    const submitTask = (e) => { e.preventDefault(); taskForm.post(route('admin.users.tasks.store', targetUser.id), { onSuccess: () => { setShowTaskModal(false); taskForm.reset(); } }); };
    const submitBudget = (e) => { e.preventDefault(); budgetForm.post(route('admin.users.budgets.store', targetUser.id), { onSuccess: () => { setShowBudgetModal(false); budgetForm.reset(); } }); };
    const submitNote = (e) => { e.preventDefault(); noteForm.post(route('admin.users.notes.store', targetUser.id), { onSuccess: () => { setShowNoteModal(false); noteForm.reset(); } }); };
    const submitChat = (e) => { e.preventDefault(); chatForm.post(route('admin.users.messages.store', targetUser.id), { onSuccess: () => chatForm.reset() }); };

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
                        <h2 className="text-2xl font-bold text-burgundy">Kelola: {targetUser.name}</h2>
                        <p className="text-sm text-gray-600">{targetUser.email} · Partner: {targetUser.partner_name || '-'} · {formatDate(targetUser.wedding_date)}</p>
                    </div>
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

                {/* Dashboard */}
                {tab === 'dashboard' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Budget</p><p className="text-xl font-bold">Rp {formatRp(targetUser.total_budget)}</p></div>
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Spent</p><p className="text-xl font-bold text-red-600">Rp {formatRp(totalSpent)}</p></div>
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Task</p><p className="text-xl font-bold text-blue-600">{taskProgress}%</p></div>
                            <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Budget</p><p className="text-xl font-bold text-rose">{budgetPercent}%</p></div>
                        </div>
                    </div>
                )}

                {/* Tasks */}
                {tab === 'tasks' && (
                    <div className="space-y-4">
                        <button onClick={() => setShowTaskModal(true)} className="rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">+ Tambah Task</button>
                        <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            <table className="min-w-full text-sm"><thead className="bg-cream/50"><tr><th className="px-3 py-2 text-left">Judul</th><th className="px-3 py-2 text-left">Kat</th><th className="px-3 py-2 text-left">Deadline</th><th className="px-3 py-2 text-left">Status</th></tr></thead>
                                <tbody>{tasks.map(t => (<tr key={t.id} className="border-t"><td className="px-3 py-2">{t.title}</td><td className="px-3 py-2">{t.category}</td><td className="px-3 py-2">{formatDate(t.deadline)}</td><td className="px-3 py-2 capitalize">{t.status}</td></tr>))}</tbody>
                            </table>
                        </div>
                        {showTaskModal && <Modal title="Tambah Task" onClose={() => setShowTaskModal(false)}>
                            <form onSubmit={submitTask} className="space-y-3">
                                <input type="text" value={taskForm.data.title} onChange={e => taskForm.setData('title', e.target.value)} placeholder="Judul" className="w-full rounded border-gray-300" required />
                                <div className="grid grid-cols-2 gap-3">
                                    <select value={taskForm.data.category} onChange={e => taskForm.setData('category', e.target.value)} className="rounded border-gray-300">{taskCategories.map(c => <option key={c}>{c}</option>)}</select>
                                    <select value={taskForm.data.priority} onChange={e => taskForm.setData('priority', e.target.value)} className="rounded border-gray-300"><option>low</option><option>medium</option><option>high</option></select>
                                </div>
                                <input type="date" value={taskForm.data.deadline} onChange={e => taskForm.setData('deadline', e.target.value)} className="w-full rounded border-gray-300" />
                                <button type="submit" disabled={taskForm.processing} className="w-full rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">Simpan</button>
                            </form>
                        </Modal>}
                    </div>
                )}

                {/* Budgets */}
                {tab === 'budgets' && (
                    <div className="space-y-4">
                        <button onClick={() => setShowBudgetModal(true)} className="rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">+ Tambah Budget</button>
                        <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            <table className="min-w-full text-sm"><thead className="bg-cream/50"><tr><th className="px-3 py-2 text-left">Deskripsi</th><th className="px-3 py-2 text-left">Kat</th><th className="px-3 py-2 text-left">Jumlah</th><th className="px-3 py-2 text-left">Status</th></tr></thead>
                                <tbody>{budgets.map(b => (<tr key={b.id} className="border-t"><td className="px-3 py-2">{b.description}</td><td className="px-3 py-2">{b.category}</td><td className="px-3 py-2">Rp {formatRp(b.amount)}</td><td className="px-3 py-2 capitalize">{b.status}</td></tr>))}</tbody>
                            </table>
                        </div>
                        {showBudgetModal && <Modal title="Tambah Budget" onClose={() => setShowBudgetModal(false)}>
                            <form onSubmit={submitBudget} className="space-y-3">
                                <input type="text" value={budgetForm.data.description} onChange={e => budgetForm.setData('description', e.target.value)} placeholder="Deskripsi" className="w-full rounded border-gray-300" required />
                                <div className="grid grid-cols-2 gap-3">
                                    <select value={budgetForm.data.category} onChange={e => budgetForm.setData('category', e.target.value)} className="rounded border-gray-300">{budgetCategories.map(c => <option key={c}>{c}</option>)}</select>
                                    <input type="number" value={budgetForm.data.amount} onChange={e => budgetForm.setData('amount', e.target.value)} placeholder="Jumlah" className="rounded border-gray-300" required />
                                </div>
                                <input type="date" value={budgetForm.data.date} onChange={e => budgetForm.setData('date', e.target.value)} className="w-full rounded border-gray-300" required />
                                <button type="submit" disabled={budgetForm.processing} className="w-full rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">Simpan</button>
                            </form>
                        </Modal>}
                    </div>
                )}

                {/* Notes */}
                {tab === 'notes' && (
                    <div className="space-y-4">
                        <button onClick={() => setShowNoteModal(true)} className="rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">+ Tambah Catatan</button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {notes.map(n => (<div key={n.id} className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><h3 className="font-semibold text-burgundy">{n.title}</h3><p className="text-sm text-gray-600 mt-1">{n.content}</p></div>))}
                        </div>
                        {showNoteModal && <Modal title="Tambah Catatan" onClose={() => setShowNoteModal(false)}>
                            <form onSubmit={submitNote} className="space-y-3">
                                <input type="text" value={noteForm.data.title} onChange={e => noteForm.setData('title', e.target.value)} placeholder="Judul" className="w-full rounded border-gray-300" required />
                                <textarea value={noteForm.data.content} onChange={e => noteForm.setData('content', e.target.value)} rows={4} placeholder="Konten" className="w-full rounded border-gray-300" required />
                                <button type="submit" disabled={noteForm.processing} className="w-full rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">Simpan</button>
                            </form>
                        </Modal>}
                    </div>
                )}

                {/* Chat */}
                {tab === 'chat' && (
                    <div className="flex flex-col h-[500px]">
                        <div className="flex-1 overflow-y-auto rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 space-y-3 mb-3">
                            {messages.length === 0 ? <p className="text-center text-gray-400 py-12">Belum ada pesan.</p>
                                : messages.map(m => (
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
                            <input type="text" value={chatForm.data.message} onChange={e => chatForm.setData('message', e.target.value)}
                                placeholder="Balas pesan..." className="flex-1 rounded-md border-gray-300 shadow-sm" required />
                            <button type="submit" disabled={chatForm.processing}
                                className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover disabled:opacity-50">Kirim</button>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
