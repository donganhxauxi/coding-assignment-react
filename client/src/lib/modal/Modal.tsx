interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-lg mx-4 z-10">
        <div className="px-4 py-3 bg-gray-800 text-white text-lg font-semibold flex justify-between items-center">
          <span>{title}</span>
          <button
            onClick={onClose}
            className="text-white text-2xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
