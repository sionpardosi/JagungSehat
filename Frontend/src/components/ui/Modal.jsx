const Modal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Congratulations!🎉</h2>
                <p>{message}</p>
                <button
                    className="mt-4 p-2 bg-green-primary text-white rounded-lg"
                    onClick={onClose}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};

export default Modal;