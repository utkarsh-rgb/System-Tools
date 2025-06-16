import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function UnderDevelopment() {
  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center text-center">
      <Row>
        <Col>
          <h1 className="display-4 text-warning mb-4">
            🚧 Page Under Development 🚧
          </h1>
          <p className="lead text-muted mb-4">
            We're working hard to bring you this feature. Please check back later!
          </p>
          <Link to="/dashboard" className="btn btn-outline-primary">
            Go Back to Dashboard
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
