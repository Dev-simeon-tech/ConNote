import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";

import Home from "./pages/app/home";
import NotFound from "./pages/notFound";

import Spinner from "./components/ui/spinner";

const About = lazy(() => import("./pages/app/about"));
const Tools = lazy(() => import("./pages/app/tools"));
const SignIn = lazy(() => import("./pages/auth/signIn"));
const SignUp = lazy(() => import("./pages/auth/signUp"));
const ForgotPassword = lazy(() => import("./pages/auth/forgotPassword"));
const Quiz = lazy(() => import("./pages/app/quiz"));

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
        <Route path='/quiz' element={<Quiz />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
