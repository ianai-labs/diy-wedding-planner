import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        partner_name: '',
        wedding_date: '',
        total_budget: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                    <TextInput id="name" name="name" value={data.name}
                        className="mt-1 block w-full" autoComplete="name"
                        isFocused={true} onChange={(e) => setData('name', e.target.value)} required />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput id="email" type="email" name="email" value={data.email}
                        className="mt-1 block w-full" autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)} required />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="partner_name" value="Nama Pasangan (opsional)" />
                    <TextInput id="partner_name" name="partner_name" value={data.partner_name}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('partner_name', e.target.value)} />
                    <InputError message={errors.partner_name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="wedding_date" value="Tanggal Pernikahan" />
                    <TextInput id="wedding_date" type="date" name="wedding_date" value={data.wedding_date}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('wedding_date', e.target.value)} required />
                    <InputError message={errors.wedding_date} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="total_budget" value="Total Budget (Rp)" />
                    <TextInput id="total_budget" type="number" name="total_budget" value={data.total_budget}
                        className="mt-1 block w-full" min="0" step="1"
                        onChange={(e) => setData('total_budget', e.target.value)} required />
                    <InputError message={errors.total_budget} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput id="password" type="password" name="password" value={data.password}
                        className="mt-1 block w-full" autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)} required />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                    <TextInput id="password_confirmation" type="password" name="password_confirmation"
                        value={data.password_confirmation} className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)} required />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Sudah punya akun?
                    </Link>
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Daftar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
