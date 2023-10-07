import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layouts from "../layouts/layouts";
import HomePage from "./pages/Home";
import NotFoundPage from "./pages/404";
import Data from "./pages/data/Data";
import Dashboard from "./pages/Dashboard";
import DetailData from "./pages/data/DetailData";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layouts />}>
          <Route index element={<HomePage />} />
          <Route path='/data' element={<Data />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/data/:id' element={<DetailData />} />{" "}
          {/* Routing dinamis */}
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
