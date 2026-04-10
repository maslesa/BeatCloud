import { useAuthModal } from '../../../shared/hooks/useAuthModal';

export default function AuthButtons() {
    const { openLogin, openRegister } = useAuthModal();

    return (
        <div className="absolute top-5 left-5 flex flex-col gap-3">
            <button
                onClick={openLogin}
                className="bg-mylight px-7 py-2 rounded-lg shadow font-semibold cursor-pointer hover:scale-102 duration-200"
            >
                Sign in
            </button>

            <button
                onClick={openRegister}
                className="bg-mybg text-mylight px-7 py-2 rounded-lg font-semibold cursor-pointer hover:scale-102 duration-200"
            >
                Create account
            </button>
        </div>
    );
}