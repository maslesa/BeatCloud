import { useAlertStore } from "../../shared/hooks/useAlertStore";

export default function ErrorAlert() {
    const { message, type } = useAlertStore();

    if (!message) return null;

    const bgColor =
        type === "success"
            ? "bg-green-500"
            : type === "warning"
                ? "bg-yellow-500"
                : "bg-red-500";

    return (
        <div className="fixed top-5 right-5 z-9999 animate-slide-in">
            <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}>
                {message}
            </div>
        </div>
    );
}