
"use client";
import { Row, Col } from "react-bootstrap";
export default function BootstrapGrids(){
  return (
    <div id="wd-bs-grid-system">
      <h2>Bootstrap grid</h2>
      <Row>
        <Col className="bg-danger text-white"><h3>Left half</h3></Col>
        <Col className="bg-primary text-white"><h3>Right half</h3></Col>
      </Row>
      <div className="mt-3">
        <h2>Responsive grid system</h2>
        <Row>
          <Col xs={12} md={6} xl={3} className="bg-warning"><h3>Column A</h3></Col>
          <Col xs={12} md={6} xl={3} className="bg-primary text-white"><h3>Column B</h3></Col>
          <Col xs={12} md={6} xl={3} className="bg-danger text-white"><h3>Column C</h3></Col>
          <Col xs={12} md={6} xl={3} className="bg-success text-white"><h3>Column D</h3></Col>
        </Row>
      </div>
    </div>
  );
}
