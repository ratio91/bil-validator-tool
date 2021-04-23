import React, { FunctionComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

type AttachmentItemProps = {
  fileDescription: string;
  fileName: string;
};

const AttachmentItem: FunctionComponent<AttachmentItemProps> = ({ fileName, fileDescription }: AttachmentItemProps) => (
  <div>
    <Container fluid>
      <Row>
        <Col>
          {fileName} - {fileDescription}
        </Col>
      </Row>
    </Container>
  </div>
);

export default AttachmentItem;
