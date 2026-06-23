import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const categoryOptions = ['H-365', 'H-180', 'H-90', 'H-30', 'H-7'];

export default function TasksEdit({ task }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        category: task.category,
        description: task.description || '',
        deadline: task.deadline?.substring(0, 10) || '',
        status: task.status,
        priority: task.priority,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${task.title}`} />
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
                <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Judul</label>
                        <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <select value={data.category} onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Deadline</label>
                            <input type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="pending">Pending</option>
                                <option value="progress">Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                            <select value={data.priority} onChange={(e) => setData('priority', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)}
                            rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Link href={route('tasks.index')} className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Batal</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
