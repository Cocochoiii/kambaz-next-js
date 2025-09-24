'use client';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";

export default function ModulesControls(){
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-module-btn">
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }}/> Module
      </Button>
      <Dropdown className="float-end me-2">
        <DropdownToggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark/> Publish All
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem id="wd-publish-all"><GreenCheckmark/> Publish All</DropdownItem>
          <DropdownItem id="wd-publish-all-modules-and-items"><GreenCheckmark/> Publish all modules and items</DropdownItem>
          <DropdownItem id="wd-publish-modules-only"><GreenCheckmark/> Publish modules only</DropdownItem>
          <DropdownItem id="wd-unpublish-all-modules-and-items">Unpublish all modules and items</DropdownItem>
          <DropdownItem id="wd-unpublish-modules-only">Unpublish modules only</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button id="wd-view-progress" className="me-2" variant="secondary" size="lg">View Progress</Button>
      <Button id="wd-collapse-all" variant="secondary" size="lg">Collapse All</Button>
    </div>
  );
}
