

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-10000">
            <div className="bg-mylight text-mybg p-6 rounded-lg w-96 flex flex-col gap-1">

                <h2 className="text-2xl font-bold">Are you sure?</h2>
                <p className="text-sm opacity-70">{message}</p>

                <div className="flex justify-between gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:opacity-80 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:opacity-80 cursor-pointer"
                    >
                        Delete
                    </button>
                </div>

            </div>
        </div>
    );
}