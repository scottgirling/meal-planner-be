export class NotFoundError extends Error {
  status = 404;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class InvalidRequestError extends Error {
  status = 400;

  constructor(message: string) {
    super(message);
    this.name = "InvalidRequestError";
    Object.setPrototypeOf(this, InvalidRequestError.prototype);
  }
}