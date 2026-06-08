import { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router";

import Home from "./pages/app/home";
import NotFound from "./pages/notFound";

import Length from "./features/converters/length";
import Temperature from "./features/converters/temperature";
import Area from "./features/converters/area";
import Speed from "./features/converters/speed";
import Weight from "./features/converters/weight";
import Time from "./features/converters/time";
import Currency from "./features/converters/currency";
import Converters from "./pages/app/converters";

import AppSpinner from "./components/app-spinner";
import SidebarLayout from "./components/layout/sidebarLayout";
import { Alert } from "./components/ui/alert";
const LogIn = lazy(() => import("./pages/auth/logIn"));
const SignUp = lazy(() => import("./pages/auth/signUp"));
const Quiz = lazy(() => import("./pages/app/quiz"));

function App() {
  return (
    <Suspense fallback={<AppSpinner />}>
      <Alert />
      <Routes>
        <Route element={<SidebarLayout />}>
          <Route index path='/' element={<Navigate to='/home' replace />} />
          <Route index path='/home' element={<Home />} />

          <Route index path='/converters' element={<Converters />} />
          <Route index path='/converters/length' element={<Length />} />
          <Route index path='/converters/area' element={<Area />} />
          <Route index path='/converters/time' element={<Time />} />
          <Route index path='/converters/speed' element={<Speed />} />
          <Route index path='/converters/currency' element={<Currency />} />
          <Route
            index
            path='/converters/temperature'
            element={<Temperature />}
          />
          <Route index path='/converters/weight' element={<Weight />} />
        </Route>
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/quiz' element={<Quiz />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
