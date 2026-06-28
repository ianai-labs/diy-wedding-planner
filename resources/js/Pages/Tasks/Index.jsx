import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/utils/format';

const categoryLabels = {
    'H-365': 'H-365', 'H-180': 'H-180', 'H-90': 'H-90', 'H-30': 'H-30', 'H-7': 'H-7',
};
const statusColors = { pending: 'bg-yellow-100 text-yellow-800', progress: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800' };
const priorityColors = { low: 'bg-gray-100 text-gray-600', medium: 'bg-orange-100 text-orange-700', high: 'bg-red-100 text-red-700' };

export default function TasksIndex({ tasks, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [status, setStatus] = useState(filters.status || '');
    const [expanded, setExpanded] = useState(() => {
        const init = {};
        tasks.data.forEach(t => { if (t.children?.length) init[t.id] = true; });
        return init;
    });
    const [newSubTask, setNewSubTask] = useState({});

    const applyFilter = () => {
        router.get(route('tasks.index'), { search, category, status }, { preserveState: true, replace: true });
    };

    const updateStatus = (taskId, newStatus) => {
        router.patch(route('tasks.status', taskId), { status: newStatus }, { preserveScroll: true, preserveState: true });
    };

    const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const addSubTask = (taskId) => {
        const title = newSubTask[taskId];
        if (!title?.trim()) return;
        router.post(route('tasks.subtasks.store', taskId), { title }, {
            preserveScroll: true, preserveState: true,
            onSuccess: () => setNewSubTask(prev => ({ ...prev, [taskId]: '' })),
        });
    };

    const toggleSubTask = (taskId, subtaskId) => {
        router.patch(route('tasks.subtasks.toggle', { task: taskId, subtask: subtaskId }), {}, {
            preserveScroll: true, preserveState: true,
        });
    };

    const deleteSubTask = (taskId, subtaskId) => {
        if (!confirm('Hapus sub-task?')) return;
        router.delete(route('tasks.subtasks.destroy', { task: taskId, subtask: subtaskId }), {
            preserveScroll: true, preserveState: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checklist" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Checklist</h2>
                    <Link href={route('tasks.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">+ Tambah Task</Link>
                </div>

                <div className="flex flex-wrap gap-3 rounded-lg bg-white p-4 shadow">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari task..." className="rounded-md border-gray-300 text-sm" />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border-gray-300 text-sm">
                        <option value="">Semua Kategori</option>
                        {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border-gray-300 text-sm">
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option><option value="progress">Progress</option><option value="completed">Completed</option>
                    </select>
                    <button onClick={applyFilter} className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500">Filter</button>
                </div>

                {flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>}

                <div className="space-y-2">
                    {tasks.data.map((task) => (
                        <div key={task.id} className="rounded-lg bg-white shadow overflow-hidden">
                            {/* Main task row */}
                            <div className="flex items-center px-4 py-3 hover:bg-gray-50">
                                <button onClick={() => toggleExpand(task.id)} className="mr-3 text-gray-400 hover:text-gray-600">
                                    {expanded[task.id] ? '▼' : '▶'}
                                </button>
                                <div className="flex-1">
                                    <Link href={route('tasks.show', task.id)} className="text-sm font-medium text-indigo-600 hover:underline">{task.title}</Link>
                                    {task.children?.length > 0 && (
                                        <span className="ml-2 text-xs text-gray-400">
                                            {task.children.filter(c => c.status === 'completed').length}/{task.children.length} sub-task
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">{categoryLabels[task.category]}</span>
                                    <span className="text-xs text-gray-400">{formatDate(task.deadline)}</span>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                                    <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)}
                                        className={`rounded-full px-2 py-1 text-xs font-medium border-0 ${statusColors[task.status]}`}>
                                        <option value="pending">Pending</option><option value="progress">Progress</option><option value="completed">Completed</option>
                                    </select>
                                    <Link href={route('tasks.edit', task.id)} className="text-xs text-indigo-600 hover:underline">Edit</Link>
                                    <Link href={route('tasks.destroy', task.id)} method="delete" as="button" className="text-xs text-red-600 hover:underline"
                                        onClick={(e) => { if (!confirm('Hapus?')) e.preventDefault(); }}>Hapus</Link>
                                </div>
                            </div>

                            {/* Sub-tasks */}
                            {expanded[task.id] && (
                                <div className="bg-gray-50 border-t px-12 py-3 space-y-2">
                                    {task.children?.map((sub) => (
                                        <div key={sub.id} className="flex items-center gap-3">
                                            <input type="checkbox" checked={sub.status === 'completed'}
                                                onChange={() => toggleSubTask(task.id, sub.id)}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                            <span className={`flex-1 text-sm ${sub.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                {sub.title}
                                            </span>
                                            <button onClick={() => deleteSubTask(task.id, sub.id)} className="text-xs text-red-400 hover:text-red-600">🗑</button>
                                        </div>
                                    ))}
                                    {/* Add sub-task */}
                                    <div className="flex gap-2">
                                        <input type="text" value={newSubTask[task.id] || ''}
                                            onChange={(e) => setNewSubTask(prev => ({ ...prev, [task.id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubTask(task.id))}
                                            placeholder="+ Tambah sub-task..." className="flex-1 text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0" />
                                        <button onClick={() => addSubTask(task.id)}
                                            className="text-xs text-indigo-600 hover:underline shrink-0">Tambah</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {tasks.links && (
                    <div className="flex justify-center gap-1">
                        {tasks.links.map((l, i) => (
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
