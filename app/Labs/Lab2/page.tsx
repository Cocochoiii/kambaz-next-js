
import "./index.css";
import ForegroundColors from "./ForegroundColors";
import BackgroundColors from "./BackgroundColors";
import Borders from "./Borders";
import PaddingEx from "./Padding";
import MarginsEx from "./Margins";
import CornersEx from "./Corners";
import DimensionsEx from "./Dimensions";
import PositionsEx from "./Positions";
import ZIndexEx from "./Zindex";
import FloatEx from "./Float";
import GridLayoutEx from "./GridLayout";
import FlexEx from "./Flex";
import ReactIconsSampler from "./ReactIcons";
import BootstrapGrids from "./BootstrapGrids";
import BootstrapTables from "./BootstrapTables";
import BootstrapLists from "./BootstrapLists";
import BootstrapForms from "./BootstrapForms";
import BootstrapNavigation from "./BootstrapNavigation";
import ScreenSizeLabel from "./ScreenSizeLabel";
export default function Lab2(){
  return (
    <div id="wd-lab2">
      <ScreenSizeLabel/>
      <h2>Lab 2 - Cascading Style Sheets</h2>
      <p style={{ backgroundColor:"blue", color:"white" }}>Style attribute allows configuring look and feel.</p>
      <ForegroundColors/>
      <BackgroundColors/>
      <Borders/>
      <PaddingEx/>
      <MarginsEx/>
      <CornersEx/>
      <DimensionsEx/>
      <PositionsEx/>
      <ZIndexEx/>
      <FloatEx/>
      <GridLayoutEx/>
      <FlexEx/>
      <ReactIconsSampler/>
      <BootstrapGrids/>
      <BootstrapTables/>
      <BootstrapLists/>
      <BootstrapForms/>
      <BootstrapNavigation/>
    </div>
  );
}
