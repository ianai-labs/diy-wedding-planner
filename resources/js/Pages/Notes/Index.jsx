import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function NotesIndex({ notes, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState(null);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('notes.destroy', deleteId), {
            onSuccess: () => setDeleteId(null),
        });
    };

    return (<AuthenticatedLayout><Head title="Catatan" />
        <div className="space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-burgundy">Catatan</h2><Link href={route('notes.create')} className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover">+ Tambah</Link></div>
            <div className="flex gap-3">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari catatan..." className="rounded-md border-gray-300 text-sm" />
                <button onClick={() => router.get(route('notes.index'), { search }, { preserveState: true, replace: true })} className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800">Cari</button>
            </div>
            {flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>}
            {notes.data.length === 0 ? <p className="text-center text-gray-400 py-12">Belum ada catatan.</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.data.map((note) => (
                        <div key={note.id} className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                            {note.image_path && <img src={`/storage/${note.image_path}`} alt={note.title} className="w-full h-48 object-cover" />}
                            <div className="p-4 space-y-3">
                                <Link href={route('notes.show', note.id)}><h3 className="font-semibold text-gray-800 hover:text-rose">{note.title}</h3></Link>
                                <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
                                <div className="flex gap-3 text-sm">
                                    <Link href={route('notes.edit', note.id)} className="text-rose hover:underline">Edit</Link>
                                    <button onClick={() => setDeleteId(note.id)} className="text-red-600 hover:underline">Hapus</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <ConfirmDeleteModal
            show={deleteId !== null}
            onClose={() => setDeleteId(null)}
            onConfirm={handleDelete}
            processing={processing}
            title="Hapus Catatan"
            message="Apakah Anda yakin ingin menghapus catatan ini?"
        />
    </AuthenticatedLayout>);
}
