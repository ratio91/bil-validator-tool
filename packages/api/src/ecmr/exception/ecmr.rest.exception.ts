export class EcmrRestException extends Error {
  private response: string;

  private status: number;

  constructor(response: string, status: number) {
    super(response);
    this.response = response;
    this.status = status;

    this.name = 'EcmrRestException';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }

  getResponse(): string {
    return this.response;
  }

  getStatus(): number {
    return this.status;
  }
}
