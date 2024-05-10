import type Logger from "../classes/Logger";

export default interface Apartment {
  $url: string | undefined;
  $price: number | undefined;
  $bedrooms: number | undefined;
  $bathrooms: number | undefined;
  $new: number | undefined;
}
