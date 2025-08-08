import { Route, Routes } from "react-router";
import { SidebarContextProvider } from "../../context/sidebar.context";
import { FileSummaryContextProvider } from "../../context/fileSummary.context";

import ToolIndex from "../../components/toolIndex";
import Length from "../../features/convertors/length";
import Weight from "../../features/convertors//weight";
import Temperature from "../../features/convertors/temperature";
import Area from "../../features/convertors/area";
import Time from "../../features/convertors/time";
import Speed from "../../features/convertors/speed";
import Sidebar from "../../components/ui/sidebar";
import Currency from "../../features/convertors/currency";
import Summary from "../../features/summary";

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
              <Route path='currency' element={<Currency />} />
              <Route path='summarizer' element={<Summary />} />
            </Route>
          </Routes>
        </FileSummaryContextProvider>
      </SidebarContextProvider>
    </>
  );
};

export default Tools;
