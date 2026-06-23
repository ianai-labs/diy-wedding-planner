import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function NotesShow({ note }) {
    return (<AuthenticatedLayout><Head title={note.title} />
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-gray-800">{note.title}</h2><Link href={route('notes.index')} className="text-sm text-indigo-600 hover:underline">← Kembali</Link></div>
            <div className="rounded-lg bg-white p-6 shadow space-y-4">
                {note.image_path && <img src={`/storage/${note.image_path}`} alt={note.title} className="w-full rounded-lg object-cover max-h-96" />}
                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                <div className="flex gap-3 pt-4 border-t">
                    <Link href={route('notes.edit', note.id)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Edit</Link>
                    <Link href={route('notes.destroy', note.id)} method="delete" as="button" className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500" onClick={(e) => { if (!confirm('Hapus?')) e.preventDefault(); }}>Hapus</Link>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
