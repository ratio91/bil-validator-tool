export class EcmrParsingException extends Error {
  constructor(message?: string) {
    super(message);
    this.message = message || '';
    this.name = 'EcmrParsingException';
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}
