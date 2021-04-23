export class EcmrEventData {
  constructor(ecmrHash: string, pdfHash: string) {
    this.ecmrHash = ecmrHash;
    this.pdfHash = pdfHash;
  }

  readonly ecmrHash: string;

  readonly pdfHash: string;
}
