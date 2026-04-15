import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import DropdownMenu from "./DropdownMenu";
import { useState, useRef } from "react";
import { logout as logoutAPI } from "../../features/auth/api/auth.api";
import { useAlertStore } from "../../shared/hooks/useAlertStore";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const showAlert = useAlertStore((state) => state.showAlert);

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef();

  const handleLogout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      showAlert(error.response?.data?.message || error.message, "error");
    } finally {
      logout();
      navigate('/');
    }
  }

  return (
    <nav className="w-full flex items-center justify-between py-4 h-20 bg-mybg">

      <Link to="/home" className="text-xl font-bold">
        BeatCloud
      </Link>

      <div className="flex justify-center items-center gap-3">
        <input className="w-120 bg-mybg2 px-3 py-2.5 rounded-sm outline-0 text-smd" placeholder="Search..." type="text" />
        <button className="flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer duration-200"><img className="w-5" src="/icons/filter.png" alt="" /></button>
        <button className="flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer duration-200"><img className="w-5" src="/icons/search.png" alt="" /></button>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <>
            <button
              className="bg-mybg2 w-30 p-1 py-2.5 mr-3 rounded-sm text-sm cursor-pointer duration-200 hover:opacity-80"
            >
              Upload
            </button>
            <button
              onClick={() => navigate(`/profile/${user.username}`)}
              className="hover:opacity-80 cursor-pointer duration-200 mr-8"
            >
              <img className="w-7 rounded-full" src={user.profileImageURL} alt="" />
            </button>

            <button
              className="opacity-60 hover:opacity-100 cursor-pointer duration-200"
            >
              <img className="w-5 rounded-full" src="/icons/notification.png" alt="" />
            </button>

            <div className="relative flex items-center">
              <button
                ref={triggerRef}
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="opacity-60 hover:opacity-100 cursor-pointer duration-200"
              >
                <img className="w-5" src="/icons/more.png" alt="" />
              </button>

              <DropdownMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                triggerRef={triggerRef}
              >
                <div className="border-t border-mybg my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left font-bold text-red-400 rounded-md px-4 py-2 hover:bg-mybg duration-100 cursor-pointer"
                >
                  Sign out
                </button>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}