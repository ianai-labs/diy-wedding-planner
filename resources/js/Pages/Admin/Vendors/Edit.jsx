import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
const categories = ['photography', 'decoration', 'catering', 'mua', 'mc', 'venue', 'others'];
const catLabels = { photography: 'Fotografi', decoration: 'Dekorasi', catering: 'Katering', mua: 'MUA', mc: 'MC', venue: 'Venue', others: 'Lainnya' };

export default function AdminVendorsEdit({ vendor }) {
    const { data, setData, put, processing, errors } = useForm({ name: vendor.name, category: vendor.category, price: vendor.price, contact: vendor.contact, address: vendor.address || '', notes: vendor.notes || '', rating: vendor.rating || '' });
    return (<AuthenticatedLayout><Head title={`Edit: ${vendor.name}`} />
        <div className="max-w-2xl mx-auto space-y-6"><h2 className="text-2xl font-bold text-burgundy">Edit Vendor</h2>
            <form onSubmit={e => { e.preventDefault(); put(route('admin.vendors.update', vendor.id)); }} className="space-y-4 rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                <div><label className="block text-sm font-medium text-gray-800">Nama</label><input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-800">Kategori</label><select value={data.category} onChange={e => setData('category', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">{categories.map(c => <option key={c} value={c}>{catLabels[c]}</option>)}</select></div>
                    <div><label className="block text-sm font-medium text-gray-800">Harga (Rp)</label><input type="number" value={data.price} onChange={e => setData('price', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" min="1" required /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-800">Kontak</label><input type="text" value={data.contact} onChange={e => setData('contact', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required /></div>
                    <div><label className="block text-sm font-medium text-gray-800">Rating (1-5)</label><input type="number" value={data.rating} onChange={e => setData('rating', e.target.value)} min="1" max="5" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                </div>
                <div><label className="block text-sm font-medium text-gray-800">Alamat</label><textarea value={data.address} onChange={e => setData('address', e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                <div><label className="block text-sm font-medium text-gray-800">Catatan</label><textarea value={data.notes} onChange={e => setData('notes', e.target.value)} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" /></div>
                <div className="flex gap-3 justify-end"><Link href={route('admin.vendors.index')} className="rounded-md bg-white border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Batal</Link><button type="submit" disabled={processing} className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover disabled:opacity-50">Update</button></div>
            </form>
        </div>
    </AuthenticatedLayout>);
}
