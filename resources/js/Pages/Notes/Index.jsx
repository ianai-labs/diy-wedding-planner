import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function NotesIndex({ notes, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    return (<AuthenticatedLayout><Head title="Catatan" />
        <div className="space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-gray-800">Catatan</h2><Link href={route('notes.create')} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">+ Tambah</Link></div>
            <div className="flex gap-3">
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari catatan..." className="rounded-md border-gray-300 text-sm" />
                <button onClick={() => router.get(route('notes.index'), { search }, { preserveState: true, replace: true })} className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-500">Cari</button>
            </div>
            {flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>}
            {notes.data.length === 0 ? <p className="text-center text-gray-400 py-12">Belum ada catatan.</p> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.data.map((note) => (
                        <div key={note.id} className="rounded-lg bg-white shadow overflow-hidden">
                            {note.image_path && <img src={`/storage/${note.image_path}`} alt={note.title} className="w-full h-48 object-cover" />}
                            <div className="p-4 space-y-3">
                                <Link href={route('notes.show', note.id)}><h3 className="font-semibold text-gray-800 hover:text-indigo-600">{note.title}</h3></Link>
                                <p className="text-sm text-gray-500 line-clamp-3">{note.content}</p>
                                <div className="flex gap-3 text-sm">
                                    <Link href={route('notes.edit', note.id)} className="text-indigo-600 hover:underline">Edit</Link>
                                    <Link href={route('notes.destroy', note.id)} method="delete" as="button" className="text-red-600 hover:underline" onClick={(e) => { if (!confirm('Hapus?')) e.preventDefault(); }}>Hapus</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </AuthenticatedLayout>);
}
