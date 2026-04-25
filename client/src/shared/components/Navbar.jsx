import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/useAuthStore";
import DropdownMenu from "./DropdownMenu";
import { useState, useRef, useEffect } from "react";
import { logout as logoutAPI } from "../../features/auth/api/auth.api";
import { useAlertStore } from "../../shared/hooks/useAlertStore";
import { io } from 'socket.io-client';
import { getRecentNotifications, markNotificationAsRead } from "../../features/notification/api/notification.api";
import CustomDropdown from "../../features/track/components/CustomDropdown";
import { trackTypeOptions, keyOptions } from '../../features/track/constants/trackOptions';

export default function Navbar() {

  const user = useAuthStore((state) => state.user);

  const logout = useAuthStore((state) => state.logout);
  const showAlert = useAlertStore((state) => state.showAlert);

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const hasUnreadNotifications = notifications.some(n => !n.isRead);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    trackType: '',
    key: '',
    bpm: '',
    isDownloadable: false,
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (filters.trackType) params.append("trackType", filters.trackType);
    if (filters.key) params.append("key", filters.key);
    if (filters.bpm) params.append("bpm", filters.bpm);
    if (filters.isDownloadable) params.append("isDownloadable", "true");

    navigate(`/search?${params.toString()}`);
    setIsFiltersOpen(false);
  }

  const updateFilter = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <nav className="w-full flex items-center justify-between py-4 px-50 h-20 bg-mybg fixed top-0 left-0 z-9000">

      <Link to="/home" className="text-xl font-bold hover:opacity-80 duration-200">
        <img className="w-15" src="/icons/logo.png" alt="" />
      </Link>

      <div className="flex flex-col items-center relative">
        <div className="flex justify-center items-center gap-3">
          <input
            className="w-120 bg-mybg2 px-4 py-2.5 rounded-sm outline-0 text-sm border border-transparent focus:border-mylight/30 duration-200 mr-2"
            placeholder="Search tracks, artists, genres..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`flex items-center justify-center cursor-pointer duration-200 rounded-md ${isFiltersOpen ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
          >
            <img className="w-5" src="/icons/filter.png" alt="Filter" />
          </button>
          <button
            onClick={handleSearch}
            className="flex items-center justify-center opacity-60 hover:opacity-100 cursor-pointer duration-200 p-2"
          >
            <img className="w-5" src="/icons/search.png" alt="Search" />
          </button>
        </div>

        {isFiltersOpen && (
          <div className="absolute top-15 w-125 bg-mybg2 p-5 flex flex-col gap-5 rounded-md shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-10000">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg text-mylight">Advanced filters</h3>
              <button
                onClick={() => setFilters({ trackType: '', key: '', bpm: '', isDownloadable: false })}
                className="text-xs opacity-50 hover:opacity-100 cursor-pointer duration-150"
              >
                Reset all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs opacity-60 font-bold tracking-wider">Track Type</label>
                <CustomDropdown
                  options={[{value: '', label: 'All Types'}, ...trackTypeOptions]}
                  value={filters.trackType}
                  onChange={(val) => updateFilter('trackType', val)}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs opacity-60 font-bold tracking-wider">Key</label>
                <CustomDropdown
                  options={keyOptions}
                  value={filters.key}
                  onChange={(val) => updateFilter('key', val)}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs opacity-60 font-bold tracking-wider">BPM</label>
                <input
                  type="text"
                  placeholder="e.g. 140"
                  value={filters.bpm}
                  onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                    updateFilter('bpm', value);
                                }
                            }}
                  className="bg-mybg border-2 border-mylight rounded-md p-2 text-sm outline-none focus:ring-1 ring-mylight/50"
                />
              </div>

              <div className="flex items-end pb-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.isDownloadable}
                    onChange={(e) => updateFilter('isDownloadable', e.target.checked)}
                  />
                  <div className={`w-5 h-5 border-2 border-mylight rounded flex items-center justify-center duration-200 ${filters.isDownloadable ? 'bg-mylight' : 'bg-transparent'}`}>
                    {filters.isDownloadable && <span className="text-mybg text-xs">✔</span>}
                  </div>
                  <span className="text-sm opacity-80 group-hover:opacity-100">Downloadable</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-mylight text-mybg font-bold py-3 rounded-md hover:brightness-110 duration-200 mt-2"
            >
              Apply filters & search
            </button>
          </div>
        )}
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