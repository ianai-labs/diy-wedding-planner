import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { formatDate, formatRp } from '@/utils/format';
const catLabels = { venue: 'Venue', catering: 'Catering', decoration: 'Dekorasi', photo_video: 'Foto/Video', dress: 'Busana', ring: 'Cincin', venue: 'Venue', others: 'Lainnya' };

export default function BudgetsShow({ budget }) {
    return (<AuthenticatedLayout><Head title={budget.description} />
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-gray-800">{budget.description}</h2><Link href={route('budgets.index')} className="text-sm text-indigo-600 hover:underline">← Kembali</Link></div>
            <div className="rounded-lg bg-white p-6 shadow space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-500">Kategori</span><p className="font-medium">{catLabels[budget.category] || budget.category}</p></div>
                    <div><span className="text-sm text-gray-500">Jumlah</span><p className="font-medium">Rp {formatRp(budget.amount)}</p></div>
                    <div><span className="text-sm text-gray-500">Tanggal</span><p className="font-medium">{formatDate(budget.date)}</p></div>
                    <div><span className="text-sm text-gray-500">Status</span><p className="font-medium capitalize">{budget.status}</p></div>
                </div>
                {budget.receipt_path && <div><span className="text-sm text-gray-500">Bukti</span><a href={`/storage/${budget.receipt_path}`} target="_blank" className="ml-2 text-indigo-600 hover:underline">Lihat Bukti</a></div>}
                <div className="flex gap-3 pt-4 border-t">
                    <Link href={route('budgets.edit', budget.id)} className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500">Edit</Link>
                    <Link href={route('budgets.destroy', budget.id)} method="delete" as="button" className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500" onClick={(e) => { if (!confirm('Hapus?')) e.preventDefault(); }}>Hapus</Link>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>);
}
