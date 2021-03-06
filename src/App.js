import React, { useRef, useEffect } from 'react';
import {useLocation, Switch, BrowserRouter} from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import "./i18n";
// Layouts
import LayoutDefault from './layouts/LayoutDefault';
// Views
import Home from './views/Home';
import {ToastContainer} from "react-toastify"
import {Web3ContextProvider} from "./contexts/Web3Context"
import Shop from "./views/Shop";
// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div>
      <Web3ContextProvider>
        <ScrollReveal ref={childRef}
          children={() => (
                <Switch>
                  <AppRoute exact path="/" component={Home} layout={LayoutDefault} />
                  <AppRoute exact path="/shop" component={Shop} layout={LayoutDefault} />
                </Switch>
          )} />
      </Web3ContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
