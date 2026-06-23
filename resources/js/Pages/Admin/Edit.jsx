import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { formatDate } from '@/utils/format';

export default function AdminEdit({ targetUser }) {
    const { data, setData, put, processing, errors } = useForm({
        name: targetUser.name,
        email: targetUser.email,
        partner_name: targetUser.partner_name || '',
        wedding_date: targetUser.wedding_date || '',
        total_budget: targetUser.total_budget || 0,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', targetUser.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${targetUser.name}`} />
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
                    <Link href={route('admin.users.show', targetUser.id)} className="text-sm text-indigo-600 hover:underline">← Kembali</Link>
                </div>

                <form onSubmit={submit} className="rounded-lg bg-white p-6 shadow space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama</label>
                        <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nama Pasangan</label>
                            <input type="text" value={data.partner_name} onChange={e => setData('partner_name', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanggal Pernikahan</label>
                            <input type="date" value={data.wedding_date} onChange={e => setData('wedding_date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            {errors.wedding_date && <p className="mt-1 text-sm text-red-600">{errors.wedding_date}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Budget (Rp)</label>
                        <input type="number" value={data.total_budget} onChange={e => setData('total_budget', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" min="0" required />
                        {errors.total_budget && <p className="mt-1 text-sm text-red-600">{errors.total_budget}</p>}
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                        <Link href={route('admin.users.show', targetUser.id)} className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300">Batal</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
