import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
const formatRp = (n) => new Intl.NumberFormat('id-ID').format(n || 0);

export default function ReportsIndex({ totalTasks, completedTasks, pendingTasks, totalBudgets, totalSpent, totalVendors, totalNotes }) {
    return (<AuthenticatedLayout><Head title="Laporan" />
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Laporan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg bg-white p-6 shadow"><p className="text-sm text-gray-500">Task</p><p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p><p className="text-xs text-gray-400">{pendingTasks} pending</p></div>
                <div className="rounded-lg bg-white p-6 shadow"><p className="text-sm text-gray-500">Budget Terpakai</p><p className="text-2xl font-bold">Rp {formatRp(totalSpent)}</p><p className="text-xs text-gray-400">{totalBudgets} transaksi</p></div>
                <div className="rounded-lg bg-white p-6 shadow"><p className="text-sm text-gray-500">Vendor</p><p className="text-2xl font-bold">{totalVendors}</p></div>
                <div className="rounded-lg bg-white p-6 shadow"><p className="text-sm text-gray-500">Catatan</p><p className="text-2xl font-bold">{totalNotes}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <a href={route('reports.export-pdf')} className="rounded-lg bg-white p-6 shadow hover:shadow-md transition text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <h3 className="text-lg font-semibold text-gray-800">Export PDF</h3>
                    <p className="text-sm text-gray-500 mt-1">Unduh checklist dalam format PDF</p>
                </a>
                <a href={route('reports.export-csv')} className="rounded-lg bg-white p-6 shadow hover:shadow-md transition text-center">
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="text-lg font-semibold text-gray-800">Export CSV</h3>
                    <p className="text-sm text-gray-500 mt-1">Unduh data budget dalam format CSV</p>
                </a>
            </div>
        </div>
    </AuthenticatedLayout>);
}
