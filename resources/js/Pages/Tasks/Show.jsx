import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatDate } from '@/utils/format';

const categoryLabels = { 'H-365': 'H-365', 'H-180': 'H-180', 'H-90': 'H-90', 'H-30': 'H-30', 'H-7': 'H-7' };

export default function TasksShow({ task }) {
    return (
        <AuthenticatedLayout>
            <Head title={task.title} />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
                    <Link href={route('tasks.index')} className="text-sm text-indigo-600 hover:underline">← Kembali</Link>
                </div>
                <div className="rounded-lg bg-white p-6 shadow space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><span className="text-sm text-gray-500">Kategori</span><p className="font-medium">{task.category}</p></div>
                        <div><span className="text-sm text-gray-500">Deadline</span><p className="font-medium">{formatDate(task.deadline)}</p></div>
                        <div><span className="text-sm text-gray-500">Status</span><p className="font-medium capitalize">{task.status}</p></div>
                        <div><span className="text-sm text-gray-500">Prioritas</span><p className="font-medium capitalize">{task.priority}</p></div>
                    </div>
                    {task.description && (
                        <div><span className="text-sm text-gray-500">Deskripsi</span><p className="mt-1 text-gray-700">{task.description}</p></div>
                    )}
                    <div className="flex gap-3 pt-4 border-t">
                        <Link href={route('tasks.edit', task.id)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Edit</Link>
                        <Link href={route('tasks.destroy', task.id)} method="delete" as="button"
                            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500"
                            onClick={(e) => { if (!confirm('Hapus task ini?')) e.preventDefault(); }}>
                            Hapus
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
