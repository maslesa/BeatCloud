export default function GoogleButton() {

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }

    return (
        <button onClick={handleGoogleLogin} className="bg-mybg text-mylight w-full py-3 rounded flex items-center justify-center gap-2 cursor-pointer hover:bg-mybg2 duration-200">
            <img className="w-5" src="/icons/google.png" alt="google_img" />
            Continue with Google
        </button>
    );
}