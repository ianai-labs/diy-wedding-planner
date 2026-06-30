import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function NotesCreate() {
    const { data, setData, post, processing, errors } = useForm({ title: '', content: '', image: null });
    const submit = (e) => { e.preventDefault(); post(route('notes.store')); };
    return (<AuthenticatedLayout><Head title="Tambah Catatan" />
        <div className="max-w-2xl mx-auto space-y-6"><h2 className="text-2xl font-bold text-burgundy">Tambah Catatan</h2>
            <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                <div><label className="block text-sm font-medium text-gray-800">Judul</label><input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-800">Konten</label><textarea value={data.content} onChange={(e) => setData('content', e.target.value)} rows={6} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />{errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}</div>
                <div><label className="block text-sm font-medium text-gray-800">Gambar Inspirasi</label><input type="file" onChange={(e) => setData('image', e.target.files[0])} className="mt-1 block w-full text-sm text-gray-600" accept=".jpg,.jpeg,.png" /></div>
                <div className="flex gap-3 justify-end"><Link href={route('notes.index')} className="rounded-md bg-white border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Batal</Link><button type="submit" disabled={processing} className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover disabled:opacity-50">Simpan</button></div>
            </form>
        </div>
    </AuthenticatedLayout>);
}
