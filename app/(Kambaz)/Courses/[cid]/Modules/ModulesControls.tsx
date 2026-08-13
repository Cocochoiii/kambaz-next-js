"use client";

// The buttons above the modules.
// They all use float-end, so I write them from right to left.
// I need "use client" because React Bootstrap uses React context.
import { Button, Dropdown } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";

export default function ModulesControls() {
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Module
      </Button>

      <Dropdown className="float-end me-2">
        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item id="wd-publish-all-modules-and-items">
            <GreenCheckmark /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-publish-modules-only">
            <GreenCheckmark /> Publish modules only
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-all-modules-and-items">
            <FaBan className="text-danger me-2" /> Unpublish all modules and items
          </Dropdown.Item>
          <Dropdown.Item id="wd-unpublish-modules-only">
            <FaBan className="text-danger me-2" /> Unpublish modules only
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-view-progress">
        View Progress
      </Button>

      <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-collapse-all">
        Collapse All
      </Button>
    </div>
  );
}
