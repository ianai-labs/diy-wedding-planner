import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function NotesEdit({ note }) {
    const { data, setData, put, processing, errors } = useForm({ title: note.title, content: note.content, image: null });
    const submit = (e) => { e.preventDefault(); put(route('notes.update', note.id)); };
    return (<AuthenticatedLayout><Head title={`Edit: ${note.title}`} />
        <div className="max-w-2xl mx-auto space-y-6"><h2 className="text-2xl font-bold text-gray-800">Edit Catatan</h2>
            <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow">
                <div><label className="block text-sm font-medium text-gray-700">Judul</label><input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                <div><label className="block text-sm font-medium text-gray-700">Konten</label><textarea value={data.content} onChange={(e) => setData('content', e.target.value)} rows={6} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                {note.image_path && <div><p className="text-xs text-gray-500">Gambar saat ini: <a href={`/storage/${note.image_path}`} target="_blank" className="text-indigo-600 hover:underline">Lihat</a></p></div>}
                <div><label className="block text-sm font-medium text-gray-700">Ganti Gambar</label><input type="file" onChange={(e) => setData('image', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500" accept=".jpg,.jpeg,.png" /></div>
                <div className="flex gap-3 justify-end"><Link href={route('notes.index')} className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Batal</Link><button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">Update</button></div>
            </form>
        </div>
    </AuthenticatedLayout>);
}
