import { Navigation } from './src/navigation';
import { UserProvider } from './src/context/UserContext';
import { ProfileProvider } from './src/context/ProfileContext';

export default function App() {
  return (
    <UserProvider>
      <ProfileProvider>
        <Navigation />
      </ProfileProvider>
    </UserProvider>
  );
}
