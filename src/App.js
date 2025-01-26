import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './views/Login/Login';
import SignUp from './views/SignUp/SignUp';
import VerificationPage from './views/VerificationPage/VerificationPage'; // Import the VerificationPage component
import Vote from './views/Vote/Vote'; // Import the Vote component
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import AppContent from './AppContent';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import React, { Suspense, useEffect } from 'react';
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }
    if (isColorModeSet()) {
      return;
    }
    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/vote" element={<Vote />} /> {/* Protect Vote route */}
          </Route>
          <Route path="*" element={<AppContent />} />
          <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirection */}
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
