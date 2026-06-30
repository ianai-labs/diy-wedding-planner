import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { formatDate, formatRp } from '@/utils/format';
const catLabels = { venue: 'Venue', catering: 'Catering', decoration: 'Dekorasi', photo_video: 'Foto/Video', dress: 'Busana', ring: 'Cincin', others: 'Lainnya' };

export default function BudgetsShow({ budget }) {
    const [showDelete, setShowDelete] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('budgets.destroy', budget.id), {
            onSuccess: () => setShowDelete(false),
        });
    };

    return (<AuthenticatedLayout><Head title={budget.description} />
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between"><h2 className="text-2xl font-bold text-burgundy">{budget.description}</h2><Link href={route('budgets.index')} className="text-sm text-rose hover:underline">← Kembali</Link></div>
            <div className="rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-sm text-gray-600">Kategori</span><p className="font-medium">{catLabels[budget.category] || budget.category}</p></div>
                    <div><span className="text-sm text-gray-600">Jumlah</span><p className="font-medium">Rp {formatRp(budget.amount)}</p></div>
                    <div><span className="text-sm text-gray-600">Tanggal</span><p className="font-medium">{formatDate(budget.date)}</p></div>
                    <div><span className="text-sm text-gray-600">Status</span><p className="font-medium capitalize">{budget.status}</p></div>
                </div>
                {budget.receipt_path && <div><span className="text-sm text-gray-600">Bukti</span><a href={`/storage/${budget.receipt_path}`} target="_blank" className="ml-2 text-rose hover:underline">Lihat Bukti</a></div>}
                <div className="flex gap-3 pt-4 border-t">
                    <Link href={route('budgets.edit', budget.id)} className="rounded-md bg-rose px-4 py-2 text-sm text-white hover:bg-rose-hover">Edit</Link>
                    <button onClick={() => setShowDelete(true)}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500">Hapus</button>
                </div>
            </div>
        </div>

        <ConfirmDeleteModal
            show={showDelete}
            onClose={() => setShowDelete(false)}
            onConfirm={handleDelete}
            processing={processing}
            title="Hapus Budget"
            message="Apakah Anda yakin ingin menghapus data budget ini?"
        />
    </AuthenticatedLayout>);
}
