// import React from 'react';
// import { withAuthenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

// function App({ signOut, user }: any) {
//   return (
//     <div>
//       <h1>Hello, {user.username}</h1>
//       <button onClick={signOut}>Sign out</button>
//     </div>
//   );
// }

// export default withAuthenticator(App);

import React, { useState, useEffect } from 'react';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import Login from './Login';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    getCurrentUser()
      .then((userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const handleLoginSuccess = () => {
    getCurrentUser().then(setUser);
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome, {user.username}!</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
