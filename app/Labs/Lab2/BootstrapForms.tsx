"use client";
import {
    Form, FormGroup, FormLabel, FormControl, FormSelect,
    Row, Col, InputGroup
} from "react-bootstrap";

export default function BootstrapForms() {
    return (
        <div className="my-3">
            <div id="wd-css-styling-forms">
                <h2>Forms</h2>
                <FormGroup className="mb-3" controlId="wd-email">
                    <FormLabel>Email address</FormLabel>
                    <FormControl type="email" placeholder="name@example.com" />
                </FormGroup>
                <FormGroup className="mb-3" controlId="wd-textarea">
                    <FormLabel>Example textarea</FormLabel>
                    <FormControl as="textarea" rows={3} />
                </FormGroup>
            </div>

            <div id="wd-css-styling-dropdowns">
                <h3>Dropdowns</h3>
                <FormSelect defaultValue="">
                    <option value="">Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </FormSelect>
            </div>

            <div id="wd-css-styling-switches" className="mt-3">
                <h3>Switches</h3>
                <Form.Check type="switch" checked={false} label="Unchecked switch checkbox input" />
                <Form.Check type="switch" checked={true} label="Checked switch checkbox input" />
                <Form.Check type="switch" checked={false} label="Unchecked disabled switch" disabled />
                <Form.Check type="switch" checked={true} label="Checked disabled switch" disabled />
            </div>

            <div id="wd-css-styling-range-and-sliders" className="mt-3">
                <h3>Range</h3>
                <FormGroup controlId="wd-range1">
                    <FormLabel>Example range</FormLabel>
                    <Form.Range min="0" max="5" step="0.5" />
                </FormGroup>
            </div>

            <div id="wd-css-styling-addons" className="mt-3">
                <h3>Addons</h3>
                <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <InputGroup.Text>0.00</InputGroup.Text>
                    <FormControl />
                </InputGroup>
                <InputGroup>
                    <FormControl />
                    <InputGroup.Text>$</InputGroup.Text>
                    <InputGroup.Text>0.00</InputGroup.Text>
                </InputGroup>
            </div>

            <div id="wd-css-responsive-forms-1" className="mt-3">
                <h3>Responsive forms</h3>
                <Form.Group as={Row} className="mb-3" controlId="email1">
                    <Form.Label column sm={2}>Email</Form.Label>
                    <Col sm={10}><Form.Control type="email" value="email@example.com" /></Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="password1">
                    <Form.Label column sm={2}>Password</Form.Label>
                    <Col sm={10}><Form.Control type="password" /></Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="textarea2">
                    <Form.Label column sm={2}>Bio</Form.Label>
                    <Col sm={10}><Form.Control as="textarea" style={{ height: "100px" }} /></Col>
                </Form.Group>
            </div>
        </div>
    );
}
