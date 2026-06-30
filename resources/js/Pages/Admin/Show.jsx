import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate, formatRp } from '@/utils/format';
const catLabels = { venue: 'Venue', catering: 'Catering', decoration: 'Dekorasi', photo_video: 'Foto/Video', dress: 'Busana', ring: 'Cincin', others: 'Lainnya' };

export default function AdminShow({ targetUser, tasks, budgets, notes, totalSpent, taskProgress, budgetPercent }) {
    const [showDelete, setShowDelete] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.users.destroy', targetUser.id), {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`User: ${targetUser.name}`} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-burgundy">{targetUser.name}</h2>
                    <Link href={route('admin.index')} className="text-sm text-rose hover:underline">← Kembali ke Admin</Link>
                </div>

                {/* User info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Email</p><p className="text-sm font-medium">{targetUser.email}</p></div>
                    <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Pasangan</p><p className="text-sm font-medium">{targetUser.partner_name || '-'}</p></div>
                    <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Pernikahan</p><p className="text-sm font-medium">{formatDate(targetUser.wedding_date)}</p></div>
                    <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100"><p className="text-xs text-gray-600">Budget</p><p className="text-sm font-medium">Rp {formatRp(targetUser.total_budget)}</p></div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Link href={route('admin.users.edit', targetUser.id)} className="rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">Edit User</Link>
                    <button onClick={() => setShowDelete(true)}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">
                        Hapus User
                    </button>
                </div>

                {/* Progress bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                        <p className="text-sm font-medium">Progress Task: {taskProgress}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-2"><div className="bg-green-500 h-3 rounded-full" style={{ width: `${taskProgress}%` }} /></div>
                    </div>
                    <div className="rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                        <p className="text-sm font-medium">Budget Terpakai: {budgetPercent}% (Rp {formatRp(totalSpent)})</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 mt-2"><div className="bg-rose h-3 rounded-full" style={{ width: `${Math.min(budgetPercent, 100)}%` }} /></div>
                    </div>
                </div>

                {/* Counts */}
                <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                        { label: 'Tasks', count: tasks.length, color: 'text-blue-600' },
                        { label: 'Budgets', count: budgets.length, color: 'text-green-600' },
                        { label: 'Notes', count: notes.length, color: 'text-pink-600' },
                    ].map((s) => (
                        <div key={s.label} className="rounded-lg bg-white p-4 shadow">
                            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                            <p className="text-xs text-gray-600">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Task & Budget tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-4">
                        <h3 className="font-semibold text-burgundy mb-3">Tasks</h3>
                        {tasks.length === 0 ? <p className="text-sm text-gray-400">Belum ada task.</p> : (
                            <ul className="space-y-2">
                                {tasks.slice(0, 10).map((t) => (
                                    <li key={t.id} className="flex justify-between text-sm border-b pb-1">
                                        <span>{t.title}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'completed' ? 'bg-green-100 text-green-700' : t.status === 'progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-4">
                        <h3 className="font-semibold text-burgundy mb-3">Budgets</h3>
                        {budgets.length === 0 ? <p className="text-sm text-gray-400">Belum ada budget.</p> : (
                            <ul className="space-y-2">
                                {budgets.slice(0, 10).map((b) => (
                                    <li key={b.id} className="flex justify-between text-sm border-b pb-1">
                                        <span>{b.description} <span className="text-xs text-gray-400">({catLabels[b.category] || b.category})</span></span>
                                        <span className="font-medium">Rp {formatRp(b.amount)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                show={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                processing={processing}
                title="Hapus User"
                message="Hapus user ini beserta SEMUA datanya (tasks, budgets, notes)? Tindakan ini tidak dapat dibatalkan."
            />
        </AuthenticatedLayout>
    );
}
