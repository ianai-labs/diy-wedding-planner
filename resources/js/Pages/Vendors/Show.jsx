import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { formatRp } from '@/utils/format';

const catLabels = { photography: 'Fotografi', decoration: 'Dekorasi', catering: 'Katering', mua: 'MUA', mc: 'MC', venue: 'Venue', others: 'Lainnya' };
const stars = (n) => '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0));

export default function VendorsShow({ vendor }) {
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        date: new Date().toISOString().split('T')[0],
        description: vendor.name,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('vendors.add-to-budget', vendor.id), {
            onSuccess: () => setShowModal(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={vendor.name} />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">{vendor.name}</h2>
                    <Link href={route('vendors.index')} className="text-sm text-indigo-600 hover:underline">← Kembali</Link>
                </div>

                <div className="rounded-lg bg-white p-6 shadow space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><span className="text-sm text-gray-500">Kategori</span><p className="font-medium">{catLabels[vendor.category] || vendor.category}</p></div>
                        <div><span className="text-sm text-gray-500">Harga</span><p className="text-xl font-bold text-indigo-600">Rp {formatRp(vendor.price)}</p></div>
                        <div><span className="text-sm text-gray-500">Kontak</span><p className="font-medium">{vendor.contact}</p></div>
                        <div><span className="text-sm text-gray-500">Rating</span><p className="font-medium text-yellow-500">{stars(vendor.rating)}</p></div>
                    </div>
                    {vendor.address && <div><span className="text-sm text-gray-500">Alamat</span><p className="mt-1 text-gray-700">{vendor.address}</p></div>}
                    {vendor.notes && <div><span className="text-sm text-gray-500">Catatan</span><p className="mt-1 text-gray-700">{vendor.notes}</p></div>}

                    <div className="pt-4 border-t">
                        <button onClick={() => setShowModal(true)}
                            className="w-full rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-500">
                            + Tambahkan ke Budget
                        </button>
                    </div>
                </div>

                {/* Add to Budget Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 space-y-4">
                            <h3 className="text-lg font-semibold">Tambahkan ke Budget</h3>
                            <p className="text-sm text-gray-500">Vendor: <strong>{vendor.name}</strong> — Rp {formatRp(vendor.price)}</p>
                            <form onSubmit={submit} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                    <input type="text" value={data.description} onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                                    <input type="date" value={data.date} onChange={e => setData('date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Batal</button>
                                    <button type="submit" disabled={processing}
                                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:opacity-50">Tambahkan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
