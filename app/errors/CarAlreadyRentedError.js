/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
const ApplicationError = require('./ApplicationError');

class CarAlreadyRentedError extends ApplicationError {
  constructor(car) {
    super(`${car.name} is already rented!!`);
  }

  get details() {
    return { car };
  }
}

module.exports = CarAlreadyRentedError;
