import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function AdminChats({ usersWithChats }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);
    const { data, setData, post, processing, reset } = useForm({ message: '' });

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const loadChat = (user) => {
        setSelectedUser(user);
        fetch(route('admin.chats.messages', user.id))
            .then(r => r.json())
            .then(d => setMessages(d.messages));
    };

    const submitChat = (e) => {
        e.preventDefault();
        post(route('admin.users.messages.store', selectedUser.id), {
            onSuccess: () => {
                reset();
                loadChat(selectedUser);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Chat Support" />
            <div className="flex h-[calc(100vh-8rem)] gap-4">
                {/* User list */}
                <div className="w-80 shrink-0 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 overflow-y-auto">
                    <div className="p-3 border-b font-semibold text-burgundy">Chat Support</div>
                    {usersWithChats.length === 0 ? (
                        <p className="p-4 text-sm text-gray-400 text-center">Belum ada chat.</p>
                    ) : usersWithChats.map(u => (
                        <button key={u.id}
                            onClick={() => loadChat(u)}
                            className={`w-full text-left p-3 border-b hover:bg-rose/[0.03] transition ${selectedUser?.id === u.id ? 'bg-rose/5 border-l-4 border-l-rose' : ''}`}>
                            <p className="text-sm font-medium text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400 truncate">{u.last_message?.message}</p>
                            <p className="text-xs text-gray-300">{u.last_message?.created_at ? new Date(u.last_message.created_at).toLocaleString('id-ID') : ''}</p>
                        </button>
                    ))}
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100">
                    {!selectedUser ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400">Pilih user untuk melihat chat</div>
                    ) : (
                        <>
                            <div className="p-3 border-b font-medium text-burgundy flex justify-between items-center">
                                <span>{selectedUser.name} — {selectedUser.email}</span>
                                <Link href={route('admin.users.manage', selectedUser.id)} className="rounded-md bg-rose px-3 py-1 text-xs font-semibold text-white hover:bg-rose-hover">Kelola Plan</Link>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map(m => (
                                    <div key={m.id} className={`flex ${m.is_from_admin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-lg px-4 py-2 ${m.is_from_admin ? 'bg-rose text-white' : 'bg-gray-100 text-gray-800'}`}>
                                            <p className="text-sm">{m.message}</p>
                                            <p className={`text-xs mt-1 ${m.is_from_admin ? 'text-rose/60' : 'text-gray-400'}`}>
                                                {new Date(m.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomRef} />
                            </div>
                            <form onSubmit={submitChat} className="p-3 border-t flex gap-2">
                                <input type="text" value={data.message} onChange={e => setData('message', e.target.value)}
                                    placeholder="Balas..." className="flex-1 rounded-md border-gray-300 shadow-sm" required />
                                <button type="submit" disabled={processing}
                                    className="rounded-md bg-rose px-4 py-2 text-sm font-semibold text-white hover:bg-rose-hover">Kirim</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
