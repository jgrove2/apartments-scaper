import type IApartment from "../interfaces/IApartment";

export default class Apartment implements IApartment {
  $url: string;
  $price: number | undefined;
  $bedrooms: number | undefined;
  $bathrooms: number | undefined;
  $new: number | undefined;

  constructor(
    url: string = "",
    price: number | undefined = undefined,
    bedroom: number | undefined = undefined,
    bathroom: number | undefined = undefined,
    newIndicator: number | undefined = undefined
  ) {
    this.$url = url;
    this.$bathrooms = bathroom;
    this.$bedrooms = bedroom;
    this.$price = price;
    this.$new = newIndicator;
  }
}
