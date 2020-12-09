/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import JoinScreen from './containers/JoinScreen/JoinScreen';
import ShareScreen from './containers/ShareScreen/ShareScreen';
import routes from './constants/routes.json';
import App from './containers/App';
import Home from './containers/Home/Home';
// import HomePage from './containers/HomePage';

// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);

const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={routes.SHARE_SCREEN} component={ShareScreen} />
        <Route path={routes.COUNTER} component={CounterPage} />
        <Route path={routes.JOIN_SCREEN} component={JoinScreen} />
        <Route path={routes.HOME} component={Home} />
      </Switch>
    </App>
  );
}
