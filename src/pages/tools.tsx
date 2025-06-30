import { Route, Routes } from "react-router";
import { SidebarContextProvider } from "../context/sidebar.context";
import { FileSummaryContextProvider } from "../context/fileSummary.context";

import ToolIndex from "../components/toolIndex";
import Length from "../components/convertors/length";
import Weight from "../components/convertors/weight";
import Temperature from "../components/convertors/temperature";
import Area from "../components/convertors/area";
import Time from "../components/convertors/time";
import Speed from "../components/convertors/speed";
import Sidebar from "../components/ui/sidebar";
import Summary from "../components/summary";

const Tools = () => {
  return (
    <>
      <SidebarContextProvider>
        <FileSummaryContextProvider>
          <Routes>
            <Route index element={<ToolIndex />} />
            <Route element={<Sidebar />}>
              <Route path='length' element={<Length />} />
              <Route path='weight' element={<Weight />} />
              <Route path='temperature' element={<Temperature />} />
              <Route path='area' element={<Area />} />
              <Route path='speed' element={<Speed />} />
              <Route path='time' element={<Time />} />
              <Route path='summarizer' element={<Summary />} />
            </Route>
          </Routes>
        </FileSummaryContextProvider>
      </SidebarContextProvider>
    </>
  );
};

export default Tools;
