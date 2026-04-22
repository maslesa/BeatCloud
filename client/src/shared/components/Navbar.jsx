import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import DropdownMenu from "./DropdownMenu";
import { useState, useRef, useEffect } from "react";
import { logout as logoutAPI } from "../../features/auth/api/auth.api";
import { useAlertStore } from "../../shared/hooks/useAlertStore";
import { io } from 'socket.io-client';
import { getRecentNotifications, markNotificationAsRead } from "../../features/notification/api/notification.api";

export default function Navbar() {

  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);
  const showAlert = useAlertStore((state) => state.showAlert);

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const hasUnreadNotifications = notifications.some(n => !n.isRead);

  const notificationRef = useRef();
  const triggerRef = useRef();

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const data = await getRecentNotifications();
        setNotifications(data.notifications);
      } catch (error) {
        showAlert(error.response?.data?.message || error.message, "error");
      }
    }

    fetchNotifications();

  }, [user]);

  useEffect(() => {
    if (!user || !user.id) return;

    const socket = io(import.meta.env.VITE_BACKEND_API);

    socket.emit('join', user.id);

    socket.on('notification', (newNotif) => {
      setNotifications(prev => [newNotif, ...prev].slice(0, 10));
    });

    return () => {
      socket.disconnect();
    };

  }, [user]);

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

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) return;

    try {
      await markNotificationAsRead(notification.id);

      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      )

    } catch (error) {
      showAlert(error.response?.data?.message || error.message, "error");
    }
  }

  return (
    <nav className="w-full flex items-center justify-between py-4 px-50 h-20 bg-mybg fixed top-0 left-0 z-9000">

      <Link to="/home" className="text-xl font-bold hover:opacity-80 duration-200">
        <img className="w-15" src="/icons/logo.png" alt="" />
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
              onClick={() => navigate('/upload')}
              className="bg-mybg2 w-30 p-1 py-2.5 mr-3 rounded-sm text-sm cursor-pointer duration-200 hover:opacity-80"
            >
              Upload
            </button>
            <button
              onClick={() => navigate(`/profile/${user.username}`)}
              className="hover:opacity-80 cursor-pointer duration-200 mr-8 flex items-center justify-center"
            >
              <img className="w-7 h-7 rounded-full" src={user.profileImageURL || "/icons/default-avatar.png"} alt="" />
            </button>

            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative ${hasUnreadNotifications ? 'opacity-100' : 'opacity-60'} hover:opacity-100 cursor-pointer duration-200`}
              >
                <img className="w-5 rounded-full" src="/icons/notification.png" alt="" />
              </button>
              {isNotificationsOpen && (
                <div className="absolute -right-5 mt-4 w-80 bg-mybg2 border border-white/10 rounded-md shadow-xl overflow-hidden z-9999">
                  <div className="p-3 border-b border-white/5 font-bold text-lg">Notifications</div>
                  <div className="max-h-96 overflow-y-auto bg-mybg">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div
                          onClick={() => handleNotificationClick(n)}
                          key={n.id}
                          className={`flex gap-1 py-2 h-18 justify-between items-center p-2 border-b border-white/5 text-xs hover:bg-white/5 cursor-pointer ${!n.isRead ? 'bg-white/5' : ''}`}
                        >
                          <img className="min-w-8 max-w-8 mr-2" src={n.sender?.profileImageURL || '/icons/default-avatar.png'} alt="" />
                          <div className="w-full flex flex-col gap-2">
                            <p><b>{n.sender?.username}</b> {n.message}</p>
                            <p className="opacity-60">{new Date(n.createdAt).toLocaleTimeString()}</p>
                          </div>
                          <img className="min-w-12 max-w-12 min-h-12 max-h-12" src={n.track?.coverURL} alt="" />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-mylight/60 text-xs">No notifications yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>



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