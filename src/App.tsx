import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";

import Home from "./pages/home";

import Spinner from "./components/ui/spinner";

const About = lazy(() => import("./pages/about"));
const Tools = lazy(() => import("./pages/tools"));
const SignIn = lazy(() => import("./pages/signIn"));
const SignUp = lazy(() => import("./pages/signUp"));
const ForgotPassword = lazy(() => import("./pages/forgotPassword"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/tools/*' element={<Tools />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </Suspense>
  );
}

export default App;
