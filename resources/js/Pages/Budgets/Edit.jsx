import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';

export default function BudgetsEdit({ budget }) {
    const { data, setData, put, processing, errors } = useForm({
        category: budget.category,
        description: budget.description,
        amount: budget.amount,
        date: budget.date?.substring(0, 10) || '',
        status: budget.status,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('budgets.update', budget.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${budget.description}`} />
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Budget</h2>
                <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                        <input type="text" value={data.description} onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        <InputError message={errors.description} className="mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
                        <input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" min="1" required />
                        <InputError message={errors.amount} className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                            <input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            <InputError message={errors.date} className="mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="planned">Planned</option>
                                <option value="spent">Spent</option>
                            </select>
                            <InputError message={errors.status} className="mt-1" />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-2">
                        <Link href={route('budgets.index')} className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Batal</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
