import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

const categories = ['venue', 'catering', 'decoration', 'photo_video', 'dress', 'ring', 'others'];
const catLabels = { venue: 'Venue', catering: 'Catering', decoration: 'Dekorasi', photo_video: 'Foto/Video', dress: 'Busana', ring: 'Cincin', others: 'Lainnya' };

export default function BudgetsEdit({ budget }) {
    const { data, setData, put, processing, errors } = useForm({
        category: budget.category,
        description: budget.description,
        amount: budget.amount,
        date: budget.date?.substring(0, 10) || '',
        status: budget.status,
        receipt: null,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('budgets.update', budget.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${budget.description}`} />
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-burgundy">Edit Budget</h2>
                <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Deskripsi</label>
                        <input type="text" value={data.description} onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        <InputError message={errors.description} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Kategori</label>
                            <select value={data.category} onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                {categories.map((c) => <option key={c} value={c}>{catLabels[c]}</option>)}
                            </select>
                            <InputError message={errors.category} className="mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Jumlah (Rp)</label>
                            <input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" min="1" required />
                            <InputError message={errors.amount} className="mt-1" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Tanggal</label>
                            <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            <InputError message={errors.date} className="mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Status</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="planned">Planned</option>
                                <option value="spent">Spent</option>
                            </select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Bukti Pembayaran (baru)</label>
                        <input type="file" onChange={(e) => setData('receipt', e.target.files[0])}
                            className="mt-1 block w-full text-sm text-gray-600" accept=".jpg,.jpeg,.png" />
                        {budget.receipt_path && <p className="mt-1 text-xs text-gray-600">File sebelumnya: <a href={`/storage/${budget.receipt_path}`} target="_blank" className="text-rose hover:underline">Lihat</a></p>}
                        <InputError message={errors.receipt} className="mt-1" />
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <Link href={route('budgets.index')} className="rounded-md bg-white border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Batal</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
