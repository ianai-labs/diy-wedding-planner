import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatDate, formatRp } from '@/utils/format';
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const budgetColors = ['#D44D5C', '#C9A96E', '#A3B5A6', '#7B2D3E', '#F3F0F8', '#E8A87C', '#8B9DAF'];
const categoryLabels = { venue: 'Venue', catering: 'Catering', decoration: 'Dekorasi', photo_video: 'Foto/Video', dress: 'Busana', ring: 'Cincin', others: 'Lainnya' };

export default function Dashboard({
    totalBudget, totalSpent, totalPlanned, remaining, budgetPercent, budgetUsedPercent,
    totalTasks, completedTasks, pendingTasks, progressTasks, taskProgress,
    daysLeft, upcomingTasks, budgetByCategory, taskByStatus,
}) {
    const [editingBudget, setEditingBudget] = useState(false);
    const { data, setData, patch, processing } = useForm({
        total_budget: totalBudget || 0,
    });

    const pieData = {
        labels: Object.keys(budgetByCategory).map((k) => categoryLabels[k] || k),
        datasets: [{
            data: Object.values(budgetByCategory),
            backgroundColor: budgetColors,
        }],
    };

    const doughnutData = {
        labels: ['Completed', 'Progress', 'Pending'],
        datasets: [{
            data: [taskByStatus.completed || 0, taskByStatus.progress || 0, taskByStatus.pending || 0],
            backgroundColor: ['#A3B5A6', '#C9A96E', '#D44D5C'],
        }],
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
                {/* ===== LEFT COLUMN (8/12) ===== */}
                <div className="space-y-4 lg:col-span-8 lg:space-y-6">
                    {/* Countdown */}
                    {daysLeft !== null && (
                        <div className="rounded-xl bg-gradient-to-r from-rose to-rose-hover p-4 text-white shadow-lg shadow-rose/20">
                            <p className="text-xs uppercase tracking-wide opacity-80">Countdown Pernikahan</p>
                            <p className="text-2xl font-bold mt-0.5">
                                {daysLeft > 0 ? `${daysLeft} hari lagi` : daysLeft === 0 ? 'Hari ini!' : 'Sudah terlaksana'}
                            </p>
                        </div>
                    )}

                    {/* Ringkasan Budget */}
                    <div className="grid grid-cols-3 gap-3 lg:gap-4">
                        <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                            <p className="text-xs text-gray-600">Total Budget</p>
                            {editingBudget ? (
                                <form onSubmit={(e) => { e.preventDefault(); patch(route('profile.budget'), { onSuccess: () => setEditingBudget(false) }); }}
                                    className="flex items-center gap-1.5 mt-1">
                                    <input type="number" value={data.total_budget} onChange={e => setData('total_budget', e.target.value)}
                                        className="w-32 rounded-md border-gray-300 text-base font-bold" min="0" step="500000" autoFocus disabled={processing} />
                                    <button type="submit" disabled={processing} className="rounded-lg bg-rose px-2.5 py-1 text-xs text-white hover:bg-rose-hover">Simpan</button>
                                    <button type="button" onClick={() => { setEditingBudget(false); setData('total_budget', totalBudget || 0); }}
                                        className="rounded-md bg-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-300">Batal</button>
                                </form>
                            ) : (
                                <div className="flex items-center gap-1.5 mt-1">
                                    <p className="text-xl font-bold text-burgundy">Rp {formatRp(totalBudget)}</p>
                                    <button onClick={() => { setEditingBudget(true); setData('total_budget', totalBudget || 0); }}
                                        className="text-xs text-rose hover:underline">Edit</button>
                                </div>
                            )}
                        </div>
                        <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                            <p className="text-xs text-gray-600">Terpakai</p>
                            <p className="text-xl font-bold text-red-600 mt-1">Rp {formatRp(totalSpent)}</p>
                        </div>
                        <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                            <p className="text-xs text-gray-600">Sisa</p>
                            <p className={`text-xl font-bold mt-1 ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                Rp {formatRp(remaining)}
                            </p>
                        </div>
                    </div>

                    {/* Progress Budget Bar */}
                    <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-800">Progress Budget</p>
                            <p className="text-xs font-semibold text-gray-800">{budgetUsedPercent}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden flex">
                            <div className="bg-red-500 h-2" style={{ minWidth: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }} />
                            <div className="bg-rose/40 h-2" style={{ minWidth: `${totalBudget > 0 ? Math.min((totalPlanned / totalBudget) * 100, 100 - Math.min((totalSpent / totalBudget) * 100, 100)) : 0}%` }} />
                        </div>
                        <div className="flex gap-4 mt-1 text-xs text-gray-600">
                            <span>🔴 Spent {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</span>
                            <span>💗 Planned {totalBudget > 0 ? Math.round((totalPlanned / totalBudget) * 100) : 0}%</span>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                        <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-base font-semibold text-burgundy mb-3">Budget per Kategori</h3>
                            {Object.keys(budgetByCategory).length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">Belum ada data budget.</p>
                            ) : (
                                <div className="h-52"><Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 8, font: { size: 11 } } } } }} /></div>
                            )}
                        </div>
                        <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                            <h3 className="text-base font-semibold text-burgundy mb-3">Status Task</h3>
                            {totalTasks === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-8">Belum ada task.</p>
                            ) : (
                                <div className="h-52"><Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 8, font: { size: 11 } } } } }} /></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== RIGHT COLUMN (4/12) ===== */}
                <div className="space-y-4 lg:col-span-4 lg:space-y-6">
                    {/* Checklist Progress */}
                    <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                        <h3 className="text-base font-semibold text-burgundy mb-3">Progress Checklist</h3>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-gray-600">{taskProgress}% selesai</span>
                            <span className="text-xs text-gray-600">{completedTasks}/{totalTasks} task</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${taskProgress}%` }} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                                <p className="text-xl font-bold text-yellow-600">{pendingTasks}</p>
                                <p className="text-xs text-gray-600">Pending</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-blue-600">{progressTasks}</p>
                                <p className="text-xs text-gray-600">Progress</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-green-600">{completedTasks}</p>
                                <p className="text-xs text-gray-600">Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                        <h3 className="text-base font-semibold text-burgundy mb-3">Deadline Terdekat</h3>
                        {upcomingTasks.length === 0 ? (
                            <p className="text-sm text-gray-400 py-4 text-center">Belum ada task dengan deadline.</p>
                        ) : (
                            <ul className="space-y-2">
                                {upcomingTasks.map((task) => (
                                    <li key={task.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                        <div className="min-w-0 flex-1 mr-2">
                                            <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                                            <p className="text-xs text-gray-400">{task.daysLeft !== null ? `${task.daysLeft} hari lagi` : '-'}</p>
                                        </div>
                                        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${task.daysLeft !== null && task.daysLeft <= 7 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {formatDate(task.deadline)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
