"use client";

// Bootstrap form parts: text field, text area, dropdown, switches,
// slider, addons, and a form that stacks on a narrow screen.
import { Row, Col, Form, InputGroup } from "react-bootstrap";

export default function BootstrapForms() {
  return (
    <div>
      <div id="wd-css-styling-forms">
        <h2>Forms</h2>
        <Form.Group className="mb-3" controlId="wd-email">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="wd-textarea">
          <Form.Label>Example textarea</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
      </div>

      <div id="wd-css-styling-dropdowns">
        <h2>Dropdowns</h2>
        <Form.Select defaultValue="0">
          <option value="0">Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </Form.Select>
      </div>

      <div id="wd-css-styling-switches" className="mt-3">
        <h2>Switches</h2>
        <Form.Check type="switch" id="wd-switch-1" label="Unchecked switch checkbox input" />
        <Form.Check type="switch" id="wd-switch-2" label="Checked switch checkbox input" defaultChecked />
        <Form.Check type="switch" id="wd-switch-3" label="Disabled unchecked switch checkbox input" disabled />
        <Form.Check type="switch" id="wd-switch-4" label="Disabled checked switch checkbox input" defaultChecked disabled />
      </div>

      <div id="wd-css-styling-range-and-sliders" className="mt-3">
        <h2>Range and sliders</h2>
        <Form.Label htmlFor="wd-range">Example range</Form.Label>
        <Form.Range id="wd-range" min={0} max={5} step={0.5} />
      </div>

      <div id="wd-css-styling-addons" className="mt-3">
        <h2>Addons</h2>
        <InputGroup className="mb-3">
          <InputGroup.Text>$</InputGroup.Text>
          <InputGroup.Text>0.00</InputGroup.Text>
          <Form.Control />
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control />
          <InputGroup.Text>$</InputGroup.Text>
          <InputGroup.Text>0.00</InputGroup.Text>
        </InputGroup>
      </div>

      <div id="wd-css-responsive-forms" className="mt-3">
        <h2>Responsive forms</h2>
        <Form.Group as={Row} className="mb-3" controlId="wd-responsive-email">
          <Form.Label column sm={2}>Email</Form.Label>
          <Col sm={10}>
            <Form.Control type="email" defaultValue="email@example.com" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="wd-responsive-password">
          <Form.Label column sm={2}>Password</Form.Label>
          <Col sm={10}>
            <Form.Control type="password" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="wd-responsive-textarea">
          <Form.Label column sm={2}>Bio</Form.Label>
          <Col sm={10}>
            <Form.Control as="textarea" rows={3} />
          </Col>
        </Form.Group>
      </div>
    </div>
  );
}
