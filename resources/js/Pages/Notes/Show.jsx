import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function NotesShow({ note }) {
    const [showDelete, setShowDelete] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('notes.destroy', note.id), {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (<AuthenticatedLayout><Head title={note.title} />
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-burgundy">{note.title}</h2><Link href={route('notes.index')} className="text-sm text-rose hover:underline">← Kembali</Link></div>
            <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 space-y-4">
                {note.image_path && <img src={`/storage/${note.image_path}`} alt={note.title} className="w-full rounded-lg object-cover max-h-96" />}
                <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                <div className="flex gap-3 pt-4 border-t">
                    <Link href={route('notes.edit', note.id)} className="rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">Edit</Link>
                    <button onClick={() => setShowDelete(true)}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">Hapus</button>
                </div>
            </div>
        </div>

        <ConfirmDeleteModal
            show={showDelete}
            onClose={() => setShowDelete(false)}
            onConfirm={handleDelete}
            processing={processing}
            title="Hapus Catatan"
            message="Apakah Anda yakin ingin menghapus catatan ini?"
        />
    </AuthenticatedLayout>);
}
