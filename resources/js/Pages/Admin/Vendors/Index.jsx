import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatRp } from '@/utils/format';

const catLabels = { photography: 'Fotografi', decoration: 'Dekorasi', catering: 'Katering', mua: 'MUA', mc: 'MC', venue: 'Venue', others: 'Lainnya' };

export default function AdminVendorsIndex({ vendors, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [deleteId, setDeleteId] = useState(null);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('admin.vendors.destroy', deleteId), {
            onSuccess: () => setDeleteId(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Vendor" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-burgundy">Kelola Vendor</h2>
                    <Link href={route('admin.vendors.create')} className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover">+ Tambah Vendor</Link>
                </div>
                {flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>}
                <div className="flex gap-3">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari..." className="rounded-md border-gray-300 text-sm" />
                    <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-md border-gray-300 text-sm">
                        <option value="">Semua</option>
                        {Object.entries(catLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button onClick={() => router.get(route('admin.vendors.index'), { search, category }, { preserveState: true, replace: true })}
                        className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800">Filter</button>
                </div>
                <div className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-cream/50"><tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Nama</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Kategori</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Harga</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Kontak</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-600 uppercase">Aksi</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-200">
                            {vendors.data.length === 0 ? <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Tidak ada vendor.</td></tr>
                                : vendors.data.map(v => (
                                    <tr key={v.id} className="hover:bg-rose/[0.03]">
                                        <td className="px-3 py-3 font-medium text-gray-800">{v.name}</td>
                                        <td className="px-3 py-3">{catLabels[v.category] || v.category}</td>
                                        <td className="px-3 py-3">Rp {formatRp(v.price)}</td>
                                        <td className="px-3 py-3 text-xs">{v.contact}</td>
                                        <td className="px-3 py-3 space-x-2">
                                            <Link href={route('admin.vendors.edit', v.id)} className="text-rose hover:underline text-xs">Edit</Link>
                                            <button onClick={() => setDeleteId(v.id)} className="text-red-600 hover:underline text-xs">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                {vendors.links && (
                    <div className="flex justify-center gap-1">
                        {vendors.links.map((l, i) => (
                            <Link key={i} href={l.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded ${l.active ? 'bg-rose text-white' : l.url ? 'bg-white text-gray-600 hover:bg-gray-100' : 'text-gray-300 cursor-default'}`}
                                dangerouslySetInnerHTML={{ __html: l.label }} />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDeleteModal
                show={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                processing={processing}
                title="Hapus Vendor"
                message="Apakah Anda yakin ingin menghapus vendor ini?"
            />
        </AuthenticatedLayout>
    );
}
