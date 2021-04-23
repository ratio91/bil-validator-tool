export const exampleJson = {
  _id: '5e9615d9cab6ef00122938b9',
  eid: 100243253291859,
  references: [
    {
      _id: '5e96177fcab6ef0012293cc2',
      owner: 'SENDER',
      key: 'SAP-ID',
      value: '123456789060876543',
    },
    {
      _id: '5e96177fcab6ef0012293cc3',
      owner: 'DRIVER',
      key: 'Plomben-Nr',
      value: '1234567876543',
    },
  ],
  status: 'COMPLETED',
  principal: {
    _id: '5e9615d9cab6ef00122938ba',
    entityId: 9110015259889,
    companyName: 'EY Management Consulting GmbH',
    companyAddress: {
      _id: '5e9615d9cab6ef00122938bb',
      streetAndStreetNr: 'Wagramer Str 19',
      zip: '1220',
      city: 'Wien',
      country: 'AT',
      comment: '',
    },
  },
  cmr: {
    _id: '5e9615d9cab6ef00122938bc',
    attachments: [
      {
        _id: '5e9615d9cab6ef00122938c7',
        fileName: '1.png',
        fileHash: '26aaf49ff4900d357b0d9232c374f951b02426be61e50a18f17240757379ada3',
        fileDescription: 'Foto der Ware',
      },
    ],
    load: [
      {
        _id: '5e9615d9cab6ef00122938c8',
        marks: '1',
        numberOfPackages: 1,
        methodOfPacking: 'EU-PAL',
        natureOfGoods: 'geheim!',
        statisticalNr: '1234567890',
        grossWeight: 122.45,
        volume: 2.678,
      },
    ],
    successive: [
      {
        _id: '5e9615d9cab6ef00122938cc',
        entityId: 171717,
        companyName: 'LKW WALTER Internationale Transportorganisation AG',
        companyAddress: {
          _id: '5e9615d9cab6ef00122938cd',
          streetAndStreetNr: 'IZ NÖ-Süd Straße 14 15/A',
          zip: '2361',
          city: 'Laxenburg',
          country: 'AT',
          comment: '',
        },
      },
    ],
    carrierVehicles: [
      {
        _id: '5e9615d9cab6ef00122938cb',
        vehicleType: 'TRACTOR_UNIT',
        officialRegistration: 'W-12345K',
        ilu: 'GJDN59574',
        weightCapacity: 3456,
      },
    ],
    sender: {
      _id: '5e9615d9cab6ef00122938bd',
      entityId: 111111,
      companyName: 'IKEA Distribution Services GmbH & Co. KG',
      companyAddress: {
        _id: '5e9615d9cab6ef00122938be',
        streetAndStreetNr: 'Ellinghauser Str. 213',
        zip: '44359',
        city: 'Dortmund',
        country: 'DE',
        comment: '',
      },
    },
    consignee: {
      _id: '5e9615d9cab6ef00122938bf',
      entityId: 222222,
      companyName: 'IKEA Distribution Services Austria GmbH & Co OG',
      companyAddress: {
        _id: '5e9615d9cab6ef00122938c0',
        streetAndStreetNr: 'Terminalstraße 2',
        zip: '4600',
        city: 'Wels',
        country: 'AT',
        comment: '',
      },
    },
    placeOfDelivery: {
      _id: '5e9615d9cab6ef00122938c1',
      address: {
        _id: '5e9615d9cab6ef00122938c2',
        streetAndStreetNr: 'Terminalstraße 2',
        zip: '4600',
        city: 'Wels',
        country: 'AT',
        comment: '',
      },
      contact: {
        _id: '5e9615d9cab6ef00122938c3',
        contactName: '',
        contactMail: 'receiver@docs4cargo.com',
        contactPhoneNumber: '',
      },
    },
    dateOfTakeOver: '2020-02-24T00:00:00.000Z',
    placeOfTakeOver: {
      _id: '5e9615d9cab6ef00122938c4',
      address: {
        _id: '5e9615d9cab6ef00122938c5',
        streetAndStreetNr: 'Ellinghauser Str. 213',
        zip: '44359',
        city: 'Dortmund',
        country: 'DE',
        comment: '',
      },
      contact: {
        _id: '5e9615d9cab6ef00122938c6',
        contactName: '',
        contactMail: 'sender@docs4cargo.com',
        contactPhoneNumber: '',
      },
    },
    isDangerous: false,
    senderInstructions: 'test13',
    paymentInstructions: 'test14',
    carrier: {
      _id: '5e9615d9cab6ef00122938c9',
      entityId: 161616,
      companyName: 'LKW WALTER Internationale Transportorganisation AG',
      companyAddress: {
        _id: '5e9615d9cab6ef00122938ca',
        streetAndStreetNr: 'IZ NÖ-Süd Straße 14 15/A',
        zip: '2361',
        city: 'Laxenburg',
        country: 'AT',
        comment: '',
      },
    },
    carrierInstructions: 'test18',
    specialAgreements: 'test19',
    establishedAt: '2020-02-24T00:00:00.000Z',
    establishedIn: 'Dortmund',
  },
  history: [
    {
      attachments: [
        {
          _id: '5e96173acab6ef0012293b20',
          fileHash: '34a9fbafd9f0a8e767da388b1cca6723cb929ed23c731482b327780532680485',
          fileName: '1586894650367-100243253291859.jpg',
          fileDescription: 'signature',
        },
      ],
      _id: '5e96173acab6ef0012293b1f',
      cmrHash: 'd2eedb7f794ff52cf57480af5fe4e3877fbb490fa0407d4bb126189e670a1602',
      text: '{"name":"Mr Sender"}',
      status: 'ACTIVE',
      referenceField: 'SIGNATURE_OF_SENDER',
      responsible: '05673e8b-524b-4a2f-99ba-00d04010fd57',
      updatedAt: '2020-04-14T20:04:10.910Z',
      timestamp: '2020-04-14T20:04:10.910Z',
    },
    {
      attachments: [
        {
          _id: '5e961793cab6ef0012293d36',
          fileHash: 'e1d2206814054d28113e5aef3ee8817053769b19f1333f61c4aa6e93f15ae996',
          fileName: '1586894738600-100243253291859.jpg',
          fileDescription: 'signature',
        },
      ],
      _id: '5e961793cab6ef0012293d35',
      cmrHash: 'd2eedb7f794ff52cf57480af5fe4e3877fbb490fa0407d4bb126189e670a1602',
      text: '{"name":"Herr Fahrer"}',
      status: 'ACTIVE',
      referenceField: 'SIGNATURE_OF_CARRIER',
      responsible: '1e1daa46-a57f-4d79-b9cb-b668e51c02db',
      updatedAt: '2020-04-14T20:05:39.073Z',
      timestamp: '2020-04-14T20:05:39.073Z',
    },
    {
      attachments: [],
      _id: '5e9617a3cab6ef0012293e47',
      cmrHash: 'd2eedb7f794ff52cf57480af5fe4e3877fbb490fa0407d4bb126189e670a1602',
      text: 'Neue Plombe: 12345678432',
      status: 'ACTIVE',
      referenceField: 'OTHER_COMMENT',
      responsible: '1e1daa46-a57f-4d79-b9cb-b668e51c02db',
      updatedAt: '2020-04-14T20:05:55.019Z',
      timestamp: '2020-04-14T20:05:55.019Z',
    },
    {
      attachments: [
        {
          _id: '5e9617d9cab6ef0012293fba',
          fileName: 'vue error layers.jpg',
          fileHash: '2f8f79416556aeffb4bc03c6ef5652863ab528cad4829cab797c24c3323224bd',
          fileDescription: 'schadenfall foto',
        },
      ],
      _id: '5e9617d9cab6ef0012293fb9',
      cmrHash: 'd2eedb7f794ff52cf57480af5fe4e3877fbb490fa0407d4bb126189e670a1602',
      text: 'Wasserschaden!',
      status: 'ACTIVE',
      referenceField: 'CASE_OF_DAMAGE',
      responsible: '1e1daa46-a57f-4d79-b9cb-b668e51c02db',
      updatedAt: '2020-04-14T20:06:49.623Z',
      timestamp: '2020-04-14T20:06:49.623Z',
    },
    {
      attachments: [
        {
          _id: '5e96188bcab6ef00122941dd',
          fileHash: '3c5df4d3c71546c41947ea2cf8bc466ab5e799cc9357098e15a132f4078f7ece',
          fileName: '1586894986022-100243253291859.jpg',
          fileDescription: 'signature',
        },
      ],
      _id: '5e96188bcab6ef00122941dc',
      cmrHash: 'd2eedb7f794ff52cf57480af5fe4e3877fbb490fa0407d4bb126189e670a1602',
      text: '{"name":"Frau Empfänger","location":"Wels"}',
      status: 'COMPLETED',
      referenceField: 'FINALIZATION_BY_CONSIGNEE',
      responsible: 'b3ed9ce7-3554-4dbe-bf8a-10bbee852906',
      updatedAt: '2020-04-14T20:09:47.721Z',
      timestamp: '2020-04-14T20:09:47.721Z',
    },
  ],
  createdAt: '2020-04-14T19:58:17.372Z',
  updatedAt: '2020-04-14T20:09:47.721Z',
  __v: 0,
  agents: {
    FORWARDER: {
      UUID: '56f67455-b492-4abd-a6ba-fecd10d4d223',
      name: 'Admin',
      eMail: 'forwarder@docs4cargo.com',
      phoneNumber: '+431234567',
      parentId: '9110015259889',
    },
    SENDER: {
      UUID: '05673e8b-524b-4a2f-99ba-00d04010fd57',
      name: '',
      eMail: 'sender111@docs4cargo.com',
      phoneNumber: '',
      parentId: '111111',
    },
    CONSIGNEE: {
      UUID: 'b3ed9ce7-3554-4dbe-bf8a-10bbee852906',
      name: '',
      eMail: 'receiver111@docs4cargo.com',
      phoneNumber: '',
      parentId: '222222',
    },
    CARRIER: {
      UUID: '04e24dfa-8127-4c67-bd0b-70c9d4366fa6',
      name: 'c',
      eMail: 'carrier111@docs4cargo.com',
      phoneNumber: '',
      parentId: '161616',
    },
    DRIVER: {
      UUID: '1e1daa46-a57f-4d79-b9cb-b668e51c02db',
      name: 'd',
      eMail: 'driver111@docs4cargo.com',
      phoneNumber: '',
      parentId: '161616',
    },
    SUCCESSIVE: {
      UUID: 'ac9d8936-831a-4dc6-a134-13a5609a757b',
      name: 'd',
      eMail: 'driver_successive111@docs4cargo.com',
      phoneNumber: '',
      parentId: '171717',
    },
    DRIVER_SUCCESSIVE: {
      UUID: 'ac9d8936-831a-4dc6-a134-13a5609a757b',
      name: 'd',
      eMail: 'driver_successive111@docs4cargo.com',
      phoneNumber: '',
      parentId: '171717',
    },
  },
};

export default exampleJson;
