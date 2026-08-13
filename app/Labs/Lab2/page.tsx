"use client";

// Lab 2. All the CSS and Bootstrap exercises from Chapter 2.
// Chapter 2 says to use a Bootstrap Container here. I use the fluid one,
// so there is a thin padding all around the screen.
// I need "use client" because React Bootstrap uses React context.
import { Container } from "react-bootstrap";
import "./index.css";
import ScreenSizeLabel from "./ScreenSizeLabel";
import IdSelectors from "./IdSelectors";
import ClassSelectors from "./ClassSelectors";
import DocumentStructure from "./DocumentStructure";
import ForegroundColors from "./ForegroundColors";
import BackgroundColors from "./BackgroundColors";
import Borders from "./Borders";
import Padding from "./Padding";
import Margins from "./Margins";
import Corners from "./Corners";
import Dimensions from "./Dimensions";
import Positions from "./Positions";
import Zindex from "./Zindex";
import Float from "./Float";
import GridLayout from "./GridLayout";
import Flex from "./Flex";
import ReactIcons from "./ReactIcons";
import BootstrapGrids from "./BootstrapGrids";
import BootstrapTables from "./BootstrapTables";
import BootstrapLists from "./BootstrapLists";
import BootstrapForms from "./BootstrapForms";
import BootstrapNavigation from "./BootstrapNavigation";

export default function Lab2() {
  return (
    <Container fluid id="wd-lab2">
      <ScreenSizeLabel />
      <h2>Lab 2 - Cascading Style Sheets</h2>

      <h3>Styling with the STYLE attribute</h3>
      <p style={{ backgroundColor: "blue", color: "white" }}>
        The style attribute lets me change the look and feel of one element.
      </p>

      <IdSelectors />
      <ClassSelectors />
      <DocumentStructure />
      <ForegroundColors />
      <BackgroundColors />
      <Borders />
      <Padding />
      <Margins />
      <Corners />
      <Dimensions />
      <Positions />
      <Zindex />
      <Float />
      <GridLayout />
      <Flex />
      <ReactIcons />
      <BootstrapGrids />
      <BootstrapTables />
      <BootstrapLists />
      <BootstrapForms />
      <BootstrapNavigation />
    </Container>
  );
}
