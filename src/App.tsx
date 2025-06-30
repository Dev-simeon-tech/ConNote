import { Route, Routes } from "react-router";
import Home from "./pages/home";
import About from "./pages/about";
import Tools from "./pages/tools";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/tools/*' element={<Tools />} />
    </Routes>
  );
}

export default App;
