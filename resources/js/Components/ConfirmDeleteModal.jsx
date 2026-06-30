import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ConfirmDeleteModal({
    show = false,
    onClose,
    onConfirm,
    processing = false,
    title = 'Konfirmasi Hapus',
    message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        Batal
                    </SecondaryButton>
                    <DangerButton onClick={onConfirm} disabled={processing}>
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
