import React from 'react';
const routes = [
  {
    path: '/login',
    name: 'Login',
    element: React.lazy(() => import('./views/Login/Login')),
  },
  {
    path: '/signup',
    name: 'SignUp',
    element: React.lazy(() => import('./views/SignUp/SignUp')),
  },
  {
    path: '/vote',
    name: 'Vote',
    element: React.lazy(() => import('./views/Vote/Vote')),
    protected: true, // Protect this route
  },
  {
    path: '/404',
    name: 'Page404',
    element: React.lazy(() => import('./views/pages/Error/Page404')),
  },
  {
    path: '/500',
    name: 'Page500',
    element: React.lazy(() => import('./views/pages/Error/Page500')),
  },
];

export default routes;

