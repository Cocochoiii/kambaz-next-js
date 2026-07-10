"use client";
import { Row, Col } from "react-bootstrap";

export default function BootstrapGrids() {
    return (
        <div id="wd-bootstrap-grids">
            {/* Fixed layouts built with row/col: halves, thirds, and sidebar + main */}
            <div id="wd-bs-grid-layouts">
                <h2>Grid layouts</h2>

                <Row className="mb-2">
                    <Col md={6} className="bg-warning"><h4>Left half</h4></Col>
                    <Col md={6} className="bg-primary text-white"><h4>Right half</h4></Col>
                </Row>

                <Row className="mb-2">
                    <Col md={4} className="bg-success text-white"><h4>One third</h4></Col>
                    <Col md={8} className="bg-danger text-white"><h4>Two thirds</h4></Col>
                </Row>

                <Row className="mb-2">
                    <Col md={2} className="bg-warning"><h4>Sidebar</h4></Col>
                    <Col md={8} className="bg-primary text-white"><h4>Main content</h4></Col>
                    <Col md={2} className="bg-success text-white"><h4>Sidebar</h4></Col>
                </Row>
            </div>

            {/* Four columns that stack on small screens and sit side by side when wider */}
            <div id="wd-bs-responsive-abcd" className="mt-3">
                <h2>Responsive columns A, B, C, D</h2>
                <Row>
                    <Col xs={12} md={6} lg={3} className="bg-warning"><h4>A</h4></Col>
                    <Col xs={12} md={6} lg={3} className="bg-primary text-white"><h4>B</h4></Col>
                    <Col xs={12} md={6} lg={3} className="bg-danger text-white"><h4>C</h4></Col>
                    <Col xs={12} md={6} lg={3} className="bg-success text-white"><h4>D</h4></Col>
                </Row>
            </div>

            {/* Twelve columns that reflow based on the breakpoint */}
            <div id="wd-bs-responsive-dramatic" className="mt-3">
                <h2>Responsive grid system</h2>
                <Row>
                    {Array.from({ length: 12 }, (_, i) => {
                        const bg = ["bg-warning", "bg-primary text-white", "bg-danger text-white", "bg-success text-white"][i % 4];
                        return (
                            <Col key={i} xs={12} sm={6} md={4} lg={3} xl={2} xxl={1} className={bg}>
                                <h4>{i + 1}</h4>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </div>
    );
}
