import { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router";

import Home from "./pages/app/home";
import NotFound from "./pages/notFound";

import Spinner from "./components/ui/spinner";
import SidebarLayout from "./components/layout/sidebarLayout";
import { Alert } from "./components/ui/alert";
const LogIn = lazy(() => import("./pages/auth/logIn"));
const SignUp = lazy(() => import("./pages/auth/signUp"));
const ForgotPassword = lazy(() => import("./pages/auth/forgotPassword"));
const Quiz = lazy(() => import("./pages/app/quiz"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Alert />
      <Routes>
        <Route element={<SidebarLayout />}>
          <Route index path='/' element={<Navigate to='/home' replace />} />
          <Route index path='/home' element={<Home />} />
        </Route>
        <Route path='/login' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/quiz' element={<Quiz />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
