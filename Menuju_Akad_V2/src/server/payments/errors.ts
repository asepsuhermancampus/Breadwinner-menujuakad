import "server-only";

export class PaymentError extends Error {
  readonly httpStatus: number;

  constructor(message: string, httpStatus = 400) {
    super(message);
    this.name = "PaymentError";
    this.httpStatus = httpStatus;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
