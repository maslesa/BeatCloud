import Router from './router';
import { useAuthModal } from '../shared/hooks/useAuthModal';
import LoginModal from '../features/auth/components/LoginModal';
import RegisterModal from '../features/auth/components/RegisterModal';

function App() {
  const { type, close } = useAuthModal();

  return (
    <>
      <Router />

      {type === 'login' && <LoginModal onClose={close} />}
      {type === 'register' && <RegisterModal onClose={close} />}
    </>
  );
}

export default App;