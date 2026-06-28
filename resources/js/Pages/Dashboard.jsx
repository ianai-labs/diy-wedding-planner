import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatDate, formatRp } from '@/utils/format';
import { useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const budgetColors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];
const categoryLabels = { venue: 'Venue', catering: 'Catering', decoration: 'Dekorasi', photo_video: 'Foto/Video', dress: 'Busana', ring: 'Cincin', others: 'Lainnya' };

export default function Dashboard({
    totalBudget, totalSpent, remaining, budgetPercent,
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
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        }],
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Countdown */}
                {daysLeft !== null && (
                    <div className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white shadow">
                        <p className="text-sm uppercase tracking-wide opacity-80">Countdown Pernikahan</p>
                        <p className="text-3xl font-bold mt-1">
                            {daysLeft > 0 ? `${daysLeft} hari lagi` : daysLeft === 0 ? 'Hari ini!' : 'Sudah terlaksana'}
                        </p>
                    </div>
                )}

                {/* Ringkasan Budget */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm text-gray-500">Total Budget</p>
                        {editingBudget ? (
                            <form onSubmit={(e) => { e.preventDefault(); patch(route('profile.budget'), { onSuccess: () => setEditingBudget(false) }); }}
                                className="flex items-center gap-2 mt-1">
                                <input type="number" value={data.total_budget} onChange={e => setData('total_budget', e.target.value)}
                                    className="w-40 rounded-md border-gray-300 text-lg font-bold" min="0" step="500000" autoFocus disabled={processing} />
                                <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-500">Simpan</button>
                                <button type="button" onClick={() => { setEditingBudget(false); setData('total_budget', totalBudget || 0); }}
                                    className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-300">Batal</button>
                            </form>
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-2xl font-bold text-gray-800">Rp {formatRp(totalBudget)}</p>
                                <button onClick={() => { setEditingBudget(true); setData('total_budget', totalBudget || 0); }}
                                    className="text-sm text-indigo-600 hover:underline">Edit</button>
                            </div>
                        )}
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm text-gray-500">Terpakai</p>
                        <p className="text-2xl font-bold text-red-600">Rp {formatRp(totalSpent)}</p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <p className="text-sm text-gray-500">Sisa</p>
                        <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Rp {formatRp(remaining)}
                        </p>
                    </div>
                </div>

                {/* Progress Budget Bar */}
                <div className="rounded-lg bg-white p-6 shadow">
                    <p className="text-sm font-medium text-gray-700 mb-2">Progress Budget: {budgetPercent}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className="bg-indigo-600 h-4 rounded-full" style={{ width: `${Math.min(budgetPercent, 100)}%` }} />
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget per Kategori</h3>
                        {Object.keys(budgetByCategory).length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">Belum ada data budget.</p>
                        ) : (
                            <div className="h-64"><Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} /></div>
                        )}
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Task</h3>
                        {totalTasks === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">Belum ada task.</p>
                        ) : (
                            <div className="h-64"><Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} /></div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Checklist Progress */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Checklist</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">{taskProgress}% selesai</span>
                            <span className="text-sm text-gray-500">{completedTasks}/{totalTasks} task</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div className="bg-green-500 h-3 rounded-full" style={{ width: `${taskProgress}%` }} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div><p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p><p className="text-xs text-gray-500">Pending</p></div>
                            <div><p className="text-2xl font-bold text-blue-600">{progressTasks}</p><p className="text-xs text-gray-500">Progress</p></div>
                            <div><p className="text-2xl font-bold text-green-600">{completedTasks}</p><p className="text-xs text-gray-500">Completed</p></div>
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Deadline Terdekat</h3>
                        {upcomingTasks.length === 0 ? (
                            <p className="text-sm text-gray-400">Belum ada task.</p>
                        ) : (
                            <ul className="space-y-3">
                                {upcomingTasks.map((task) => (
                                    <li key={task.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">{task.title}</p>
                                            <p className="text-xs text-gray-400">{task.daysLeft !== null ? `${task.daysLeft} hari lagi` : '-'}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${task.daysLeft !== null && task.daysLeft <= 7 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
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
