import Router from './router';
import { useAuthModal } from '../shared/hooks/useAuthModal';
import LoginModal from '../features/auth/components/LoginModal';
import RegisterModal from '../features/auth/components/RegisterModal';
import AuthProvider from './AuthProvider';

function App() {
  const { type, close } = useAuthModal();

  return (
    <AuthProvider>
      <Router />

      {type === 'login' && <LoginModal onClose={close} />}
      {type === 'register' && <RegisterModal onClose={close} />}
    </AuthProvider>
  );
}

export default App;