import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
const categories = ['photography', 'decoration', 'catering', 'mua', 'mc', 'others'];
const catLabels = { photography: 'Fotografi', decoration: 'Dekorasi', catering: 'Katering', mua: 'MUA', mc: 'MC', venue: 'Venue', others: 'Lainnya' };

export default function AdminVendorsCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', category: 'photography', price: '', contact: '', address: '', notes: '', rating: '' });
    return (<AuthenticatedLayout><Head title="Tambah Vendor" />
        <div className="max-w-2xl mx-auto space-y-6"><h2 className="text-2xl font-bold text-gray-800">Tambah Vendor</h2>
            <form onSubmit={e => { e.preventDefault(); post(route('admin.vendors.store')); }} className="space-y-4 rounded-lg bg-white p-6 shadow">
                <div><label className="block text-sm font-medium text-gray-700">Nama</label><input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">Kategori</label><select value={data.category} onChange={e => setData('category', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">{categories.map(c => <option key={c} value={c}>{catLabels[c]}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700">Harga (Rp)</label><input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" min="1" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700">Kontak</label><input type="text" value={data.contact} onChange={e => setData('contact', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700">Rating (1-5)</label><input type="number" value={data.rating} onChange={e => setData('rating', e.target.value)} min="1" max="5" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700">Alamat</label><textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-700">Catatan</label><textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                <div className="flex gap-3 justify-end"><Link href={route('admin.vendors.index')} className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Batal</Link><button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">Simpan</button></div>
            </form>
        </div>
    </AuthenticatedLayout>);
}
