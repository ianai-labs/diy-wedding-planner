import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const categoryOptions = ['H-365', 'H-180', 'H-90', 'H-30', 'H-7'];

export default function TasksCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '', category: 'H-365', description: '', deadline: '',
        status: 'pending', priority: 'medium',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('tasks.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Task" />
            <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-2xl font-bold text-burgundy">Tambah Task</h2>
                <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Judul</label>
                        <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Kategori</label>
                            <select value={data.category} onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Deadline</label>
                            <input type="date" value={data.deadline} onChange={(e) => setData('deadline', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Status</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="pending">Pending</option>
                                <option value="progress">Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-800">Prioritas</label>
                            <select value={data.priority} onChange={(e) => setData('priority', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Deskripsi</label>
                        <textarea value={data.description} onChange={(e) => setData('description', e.target.value)}
                            rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Link href={route('tasks.index')} className="rounded-md bg-white border border-gray-200 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50">Batal</Link>
                        <button type="submit" disabled={processing}
                            className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover disabled:opacity-50">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
