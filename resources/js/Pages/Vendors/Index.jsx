import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { formatRp } from '@/utils/format';

const catLabels = { photography: 'Fotografi', decoration: 'Dekorasi', catering: 'Katering', mua: 'MUA', mc: 'MC', venue: 'Venue', others: 'Lainnya' };
const stars = (n) => '★'.repeat(n || 0) + '☆'.repeat(5 - (n || 0));

export default function VendorsIndex({ vendors, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || '');
    const [sort, setSort] = useState(filters.sort || 'price_asc');

    return (
        <AuthenticatedLayout>
            <Head title="Vendor List" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-burgundy">Vendor List</h2>
                </div>

                {flash?.success && <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">{flash.success}</div>}

                {/* Search & filter */}
                <div className="flex gap-3 flex-wrap items-center">
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari vendor..." className="rounded-md border-gray-300 text-sm w-64" />
                    <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-md border-gray-300 text-sm">
                        <option value="">Semua Kategori</option>
                        {Object.entries(catLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button onClick={() => router.get(route('vendors.index'), { search, category, sort }, { preserveState: true, replace: true })}
                        className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-800">Filter</button>
                    <button onClick={() => {
                        const newSort = sort === 'price_asc' ? 'price_desc' : 'price_asc';
                        setSort(newSort);
                        router.get(route('vendors.index'), { search, category, sort: newSort }, { preserveState: true, replace: true });
                    }}
                        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-1"
                        title={sort === 'price_asc' ? 'Termurah dulu' : 'Termahal dulu'}>
                        {sort === 'price_asc' ? '↑' : '↓'} Harga
                    </button>
                </div>

                {/* Card Grid */}
                {vendors.data.length === 0 ? (
                    <p className="text-center text-gray-400 py-12">Tidak ada vendor ditemukan.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vendors.data.map((v) => (
                                <div key={v.id} className="rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition overflow-hidden">
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <Link href={route('vendors.show', v.id)} className="font-semibold text-gray-800 hover:text-rose">{v.name}</Link>
                                            <span className="text-xs px-2 py-0.5 rounded-lg bg-rose/5 text-rose">{catLabels[v.category] || v.category}</span>
                                        </div>
                                        <p className="text-lg font-bold text-rose">Rp {formatRp(v.price)}</p>
                                        <p className="text-xs text-gray-400">{v.contact} {v.address ? `· ${v.address}` : ''}</p>
                                        <p className="text-yellow-500 text-sm">{stars(v.rating)}</p>
                                        <div className="flex gap-2 pt-2 border-t">
                                            <Link href={route('vendors.show', v.id)} className="rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-800 hover:bg-gray-200">Detail</Link>
                                            <Link href={route('vendors.show', v.id) + '?add=1'} className="rounded-md bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-500">+ Budget</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
