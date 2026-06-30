import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
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

    // Delete confirmation states
    const [deleteTaskId, setDeleteTaskId] = useState(null);
    const [deleteSubTaskRef, setDeleteSubTaskRef] = useState(null); // { taskId, subtaskId }
    const { delete: destroyTask, processing: deleteTaskProcessing } = useForm();
    const [deleteSubProcessing, setDeleteSubProcessing] = useState(false);

    const applyFilter = () => {
        router.get(route('tasks.index'), { search, category, status }, { preserveState: true, replace: true });
    };

    const reloadTasks = () => router.reload({ only: ['tasks', 'filters'] });

    const updateStatus = async (taskId, newStatus) => {
        await fetch(route('tasks.status', taskId), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({ status: newStatus }),
        });
        reloadTasks();
    };

    const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const addSubTask = async (taskId) => {
        const title = newSubTask[taskId];
        if (!title?.trim()) return;
        await fetch(route('tasks.subtasks.store', taskId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
            body: JSON.stringify({ title }),
        });
        setNewSubTask(prev => ({ ...prev, [taskId]: '' }));
        reloadTasks();
    };

    const toggleSubTask = async (taskId, subtaskId) => {
        await fetch(route('tasks.subtasks.toggle', { task: taskId, subtask: subtaskId }), {
            method: 'PATCH',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
        });
        reloadTasks();
    };

    const confirmDeleteSubTask = async () => {
        if (!deleteSubTaskRef) return;
        const { taskId, subtaskId } = deleteSubTaskRef;
        setDeleteSubProcessing(true);
        await fetch(route('tasks.subtasks.destroy', { task: taskId, subtask: subtaskId }), {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
            },
        });
        setDeleteSubProcessing(false);
        setDeleteSubTaskRef(null);
        reloadTasks();
    };

    const handleDeleteTask = () => {
        destroyTask(route('tasks.destroy', deleteTaskId), {
            onSuccess: () => setDeleteTaskId(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Checklist" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-burgundy">Checklist</h2>
                    <Link href={route('tasks.create')} className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover">+ Tambah Task</Link>
                </div>

                <div className="flex flex-wrap gap-3 rounded-xl bg-white p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari task..." className="rounded-md border-gray-300 text-sm" />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border-gray-300 text-sm">
                        <option value="">Semua Kategori</option>
                        {Object.entries(categoryLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border-gray-300 text-sm">
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option><option value="progress">Progress</option><option value="completed">Completed</option>
                    </select>
                    <button onClick={applyFilter} className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800">Filter</button>
                </div>

                {flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>}

                <div className="space-y-2">
                    {tasks.data.map((task) => (
                        <div key={task.id} className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            {/* Main task row */}
                            <div className="flex items-center px-4 py-3 hover:bg-rose/[0.03]">
                                <button onClick={() => toggleExpand(task.id)} className="mr-3 text-gray-400 hover:text-gray-600">
                                    {expanded[task.id] ? '▼' : '▶'}
                                </button>
                                <div className="flex-1">
                                    <Link href={route('tasks.show', task.id)} className="text-sm font-medium text-rose hover:underline">{task.title}</Link>
                                    {task.children?.length > 0 && (
                                        <span className="ml-2 text-xs text-gray-400">
                                            {task.children.filter(c => c.status === 'completed').length}/{task.children.length} sub-task
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400">{categoryLabels[task.category]}</span>
                                    <span className="text-xs text-gray-400">{formatDate(task.deadline)}</span>
                                    <span className={`inline-flex rounded-lg px-2 py-1 text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span>
                                    <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)}
                                        className={`rounded-lg px-2 py-1 text-xs font-medium border-0 ${statusColors[task.status]}`}>
                                        <option value="pending">Pending</option><option value="progress">Progress</option><option value="completed">Completed</option>
                                    </select>
                                    <Link href={route('tasks.edit', task.id)} className="text-xs text-rose hover:underline">Edit</Link>
                                    <button onClick={() => setDeleteTaskId(task.id)} className="text-xs text-red-600 hover:underline">Hapus</button>
                                </div>
                            </div>

                            {/* Sub-tasks */}
                            {expanded[task.id] && (
                                <div className="bg-gray-50 border-t px-12 py-3 space-y-2">
                                    {task.children?.map((sub) => (
                                        <div key={sub.id} className="flex items-center gap-3">
                                            <input type="checkbox" checked={sub.status === 'completed'}
                                                onChange={() => toggleSubTask(task.id, sub.id)}
                                                className="rounded border-gray-300 text-rose focus:ring-rose" />
                                            <span className={`flex-1 text-sm ${sub.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                {sub.title}
                                            </span>
                                            <button onClick={() => setDeleteSubTaskRef({ taskId: task.id, subtaskId: sub.id })}
                                                className="text-xs text-red-400 hover:text-red-600">🗑</button>
                                        </div>
                                    ))}
                                    {/* Add sub-task */}
                                    <div className="flex gap-2">
                                        <input type="text" value={newSubTask[task.id] || ''}
                                            onChange={(e) => setNewSubTask(prev => ({ ...prev, [task.id]: e.target.value }))}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubTask(task.id))}
                                            placeholder="+ Tambah sub-task..." className="flex-1 text-sm border-0 border-b border-gray-300 bg-transparent focus:ring-0" />
                                        <button onClick={() => addSubTask(task.id)}
                                            className="text-xs text-rose hover:underline shrink-0">Tambah</button>
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
                                className={`px-3 py-1.5 text-sm rounded ${l.active ? 'bg-rose text-white' : l.url ? 'bg-white text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-default'}`}
                                dangerouslySetInnerHTML={{ __html: l.label }} />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Task Modal */}
            <ConfirmDeleteModal
                show={deleteTaskId !== null}
                onClose={() => setDeleteTaskId(null)}
                onConfirm={handleDeleteTask}
                processing={deleteTaskProcessing}
                title="Hapus Task"
                message="Apakah Anda yakin ingin menghapus task ini? Sub-task juga akan ikut terhapus."
            />

            {/* Delete Sub-task Modal */}
            <ConfirmDeleteModal
                show={deleteSubTaskRef !== null}
                onClose={() => setDeleteSubTaskRef(null)}
                onConfirm={confirmDeleteSubTask}
                processing={deleteSubProcessing}
                title="Hapus Sub-Task"
                message="Apakah Anda yakin ingin menghapus sub-task ini?"
            />
        </AuthenticatedLayout>
    );
}
