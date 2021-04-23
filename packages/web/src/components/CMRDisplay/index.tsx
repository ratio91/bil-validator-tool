import React, { FunctionComponent } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import CompanyDetails from './components/CompanyDetails';
import Attachments from './components/Attachments';
import Load from './components/Load';
import SingleComment from './components/SingleComment';
import CMRField from './components/CMRField';
import Established from './components/Established';
import Carrier from './components/Carrier';
import { EcmrDto } from '../../dto/ecmr.dto';
import LocationDetails from './components/LocationDetails';
import { EntityDto } from '../../dto/entity.dto';

interface CMRDisplayProps {
  cmrData: EcmrDto;
}

export const generateCountryDetailString = (entity: EntityDto) => {
  return `${entity.postal} ${entity.city}, ${entity.country}`;
};

/**
 * This component renders the fields on the first page of a CMR document.
 *
 * @param cmrData eCMR data to display.
 */
const Index: FunctionComponent<CMRDisplayProps> = ({ cmrData }: CMRDisplayProps) => {
  const { t } = useTranslation('common');
  const {
    attachments,
    carrier,
    consignee,
    created_at,
    eid,
    instructions,
    load,
    sender,
    shipper,
    takeover_date,
    unloader,
    updates,
    vehicles,
  } = cmrData;

  return (
    <Container fluid>
      <Row noGutters>
        <Col sm={{ span: 6, order: 2 }}>
          <CMRField id={eid} />
        </Col>
        <Col sm={{ span: 6, order: 1 }}>
          <CompanyDetails
            address={sender.address}
            companyName={sender.company_name}
            countryDetails={generateCountryDetailString(sender)}
            title={t('CMRDisplay.Sender.title')}
          />
        </Col>
        <Col sm={{ span: 6, order: 3 }}>
          <CompanyDetails
            address={consignee.address}
            companyName={consignee.company_name}
            countryDetails={generateCountryDetailString(consignee)}
            title={t('CMRDisplay.Consignee.title')}
          />
          <LocationDetails
            address={unloader.address}
            companyName={unloader.company_name}
            countryDetails={generateCountryDetailString(unloader)}
            geoCoordinates={unloader.geocoordinates}
            headline={t('CMRDisplay.PlaceOfDelivery.title')}
          />
          <LocationDetails
            address={shipper.address}
            companyName={shipper.company_name}
            countryDetails={shipper.country}
            date={takeover_date}
            geoCoordinates={shipper.geocoordinates}
            headline={t('CMRDisplay.Takeover.title')}
          />
          <Attachments attachments={attachments} />
        </Col>
        <Col sm={{ span: 12, order: 5 }}>
          <Load load={load} />
        </Col>
        <Col sm={{ span: 12, order: 6 }}>
          <SingleComment
            noCommentText={t('CMRDisplay.SenderInstructions.noGiven')}
            text={instructions?.sender}
            title={t('CMRDisplay.SenderInstructions.title')}
          />
        </Col>
        <Col sm={{ span: 6, order: 7 }}>
          <SingleComment
            noCommentText={t('CMRDisplay.PaymentInstructions.noGiven')}
            text={instructions?.payment}
            title={t('CMRDisplay.PaymentInstructions.title')}
          />
        </Col>
        <Col sm={{ span: 6, order: 4 }}>
          <Carrier
            carrierAddress={carrier.address}
            carrierCompany={carrier.company_name}
            carrierCountryDetails={generateCountryDetailString(carrier)}
            carrierInstructions={instructions?.carrier}
            carrierVehicles={vehicles}
          />
        </Col>
        <Col sm={{ span: 6, order: 8 }}>
          <SingleComment
            noCommentText={t('CMRDisplay.SpecialAgreements.noGiven')}
            text={instructions?.agreements}
            title={t('CMRDisplay.SpecialAgreements.title')}
          />
        </Col>
        <Col sm={{ span: 12, order: 9 }}>
          <Established establishedIn={updates[0]?.content.shipper_sign.place} establishedAt={created_at} />
        </Col>
      </Row>
    </Container>
  );
};

export default Index;
