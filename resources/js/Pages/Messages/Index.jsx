import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

export default function MessagesIndex({ messages }) {
    const { flash } = usePage().props;
    const bottomRef = useRef(null);
    const { data, setData, post, processing, reset } = useForm({ message: '' });

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const submit = (e) => {
        e.preventDefault();
        post(route('messages.store'), { onSuccess: () => reset() });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pesan" />
            <div className="max-w-2xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 shrink-0">Pesan dengan Admin</h2>
                {flash?.success && <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 shrink-0">{flash.success}</div>}

                {/* Chat area */}
                <div className="flex-1 overflow-y-auto rounded-lg bg-white shadow p-4 space-y-3">
                    {messages.length === 0 ? (
                        <p className="text-center text-gray-400 py-12">Belum ada pesan. Kirim pesan untuk memulai chat dengan admin.</p>
                    ) : messages.map((m) => (
                        <div key={m.id} className={`flex ${m.is_from_admin ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[75%] rounded-lg px-4 py-2 ${m.is_from_admin ? 'bg-gray-100 text-gray-800' : 'bg-indigo-600 text-white'}`}>
                                <p className="text-sm">{m.message}</p>
                                <p className={`text-xs mt-1 ${m.is_from_admin ? 'text-gray-400' : 'text-indigo-200'}`}>
                                    {new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <form onSubmit={submit} className="flex gap-2 shrink-0">
                    <input type="text" value={data.message} onChange={e => setData('message', e.target.value)}
                        placeholder="Ketik pesan..." className="flex-1 rounded-md border-gray-300 shadow-sm" required />
                    <button type="submit" disabled={processing}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50">Kirim</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
