/**
 * Represents geographical coordinates with latitude and longitude.
 */
export interface Coordinates {
  /**
   * The latitude of the location.
   */
  latitude: number;
  /**
   * The longitude of the location.
   */
  longitude: number;
}

/**
 * Asynchronously retrieves a static map image URL for the specified coordinates.
 *
 * @param coordinates The coordinates for which to retrieve the map.
 * @param zoom The zoom level of the map.
 * @returns A promise that resolves to the URL of the static map image.
 */
export async function getStaticMapUrl(coordinates: Coordinates, zoom: number): Promise<string> {
  // TODO: Implement this by calling the Google Maps Static API.

  return `https://via.placeholder.com/600x400?text=Map+of+${coordinates.latitude},${coordinates.longitude}`;
}
