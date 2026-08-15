"use client";

// The buttons above the modules. They all float right.
// The Module button opens the dialog that adds a module.
// A student only sees Collapse All. The rest is for Faculty.
import { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import ModuleEditor from "./ModuleEditor";

export default function ModulesControls({
  isFaculty,
  allCollapsed,
  toggleAll,
  moduleName,
  setModuleName,
  addModule,
  publishAll,
  toggleProgress,
}: {
  isFaculty: boolean;
  allCollapsed: boolean;
  toggleAll: () => void;
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
  publishAll: (published: boolean, withItems: boolean) => void;
  toggleProgress: () => void;
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div id="wd-modules-controls" className="text-nowrap">
      {isFaculty && (
        <>
      <Button variant="danger" size="lg" className="me-1 float-end"
              id="wd-add-module-btn" onClick={handleShow}>
        <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
        Module
      </Button>

      <ModuleEditor
        show={show}
        handleClose={handleClose}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />

      <Dropdown className="float-end me-2">
        <Dropdown.Toggle variant="secondary" size="lg" id="wd-publish-all-btn">
          <GreenCheckmark /> Publish All
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {/* Each one sends a PUT for every module. */}
          <Dropdown.Item
            id="wd-publish-all-modules-and-items"
            onClick={() => publishAll(true, true)}
          >
            <GreenCheckmark /> Publish all modules and items
          </Dropdown.Item>
          <Dropdown.Item
            id="wd-publish-modules-only"
            onClick={() => publishAll(true, false)}
          >
            <GreenCheckmark /> Publish modules only
          </Dropdown.Item>
          <Dropdown.Item
            id="wd-unpublish-all-modules-and-items"
            onClick={() => publishAll(false, true)}
          >
            <FaBan className="text-danger me-2" /> Unpublish all modules and items
          </Dropdown.Item>
          <Dropdown.Item
            id="wd-unpublish-modules-only"
            onClick={() => publishAll(false, false)}
          >
            <FaBan className="text-danger me-2" /> Unpublish modules only
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* View Progress shows how much of the course is published. */}
      <Button
        variant="secondary"
        size="lg"
        className="me-1 float-end"
        id="wd-view-progress"
        onClick={toggleProgress}
      >
        View Progress
      </Button>
        </>
      )}

      <Button variant="secondary" size="lg" className="me-1 float-end"
              id="wd-collapse-all" onClick={toggleAll}>
        {allCollapsed ? "Expand All" : "Collapse All"}
      </Button>
    </div>
  );
}
