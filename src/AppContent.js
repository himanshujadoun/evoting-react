import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { CContainer, CSpinner } from '@coreui/react';
import PrivateRoute from './components/PrivateRoute';
import routes from './routes';
// import PrivateRoute fro./components/PrivateRouteute';

const AppContent = () => {
  return (
    <CContainer className="px-4" style={{ maxWidth: '1600px' }}>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => (
            route.element && (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                element={route.protected ? <PrivateRoute element={route.element} /> : <route.element />}
              />
            )
          ))}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
