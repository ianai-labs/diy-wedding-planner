import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate } from '@/utils/format';

const categoryLabels = { 'H-365': 'H-365', 'H-180': 'H-180', 'H-90': 'H-90', 'H-30': 'H-30', 'H-7': 'H-7' };

export default function TasksShow({ task }) {
    const [showDelete, setShowDelete] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('tasks.destroy', task.id), {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={task.title} />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-burgundy">{task.title}</h2>
                    <Link href={route('tasks.index')} className="text-sm text-rose hover:underline">← Kembali</Link>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><span className="text-sm text-gray-600">Kategori</span><p className="font-medium">{task.category}</p></div>
                        <div><span className="text-sm text-gray-600">Deadline</span><p className="font-medium">{formatDate(task.deadline)}</p></div>
                        <div><span className="text-sm text-gray-600">Status</span><p className="font-medium capitalize">{task.status}</p></div>
                        <div><span className="text-sm text-gray-600">Prioritas</span><p className="font-medium capitalize">{task.priority}</p></div>
                    </div>
                    {task.description && (
                        <div><span className="text-sm text-gray-600">Deskripsi</span><p className="mt-1 text-gray-800">{task.description}</p></div>
                    )}
                    <div className="flex gap-3 pt-4 border-t">
                        <Link href={route('tasks.edit', task.id)} className="rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">Edit</Link>
                        <button onClick={() => setShowDelete(true)}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                show={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={handleDelete}
                processing={processing}
                title="Hapus Task"
                message="Apakah Anda yakin ingin menghapus task ini?"
            />
        </AuthenticatedLayout>
    );
}
