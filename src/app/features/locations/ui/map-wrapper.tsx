import { LocationsMap } from './locations-map';
import type { Location } from '../model/types';

interface MapWrapperProps {
  locations: Location[];
}

export function MapWrapper({ locations }: MapWrapperProps) {
  return <LocationsMap locations={locations} />;
}
