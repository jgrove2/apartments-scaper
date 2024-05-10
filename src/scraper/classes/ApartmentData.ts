import type IApartmentData from "../interfaces/IApartmentData";

export default class ApartmentData implements IApartmentData {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}
