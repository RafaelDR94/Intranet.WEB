export default class Dexie {
  constructor(_name?: string) {}

  version() {
    return this;
  }

  stores() {
    return this;
  }

  open() {
    return Promise.resolve();
  }

  close() {}

  get() {
    return Promise.resolve(null);
  }

  put() {
    return Promise.resolve(1);
  }

  delete() {
    return Promise.resolve();
  }
}