import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Chat,
    Home,
    LoginSuccess,
    NotFound,
  } from 'containers';

// polyfill webpack require.ensure
if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require); // eslint-disable-line

export default (store) => {
  const requireLogin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replaceState(null, '/');
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };
  const rootRoute = {
    path: '/',
    component: App,
    indexRoute: {
      component: Home
    },
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          {
            onEnter: requireLogin,
            childRoutes: [
              {
                path: 'chat',
                component: Chat
              },
              {
                path: 'loginSuccess',
                component: LoginSuccess
              }
            ]
          },
          require('./AboutRoute'),
          require('./LoginRoute'),
          require('./SurveyRoute'),
          require('./WidgetsRoute'),
          {
            path: '*',
            component: NotFound,
            status: 404
          }
        ]);
      });
    }
  };

  return rootRoute;
};
