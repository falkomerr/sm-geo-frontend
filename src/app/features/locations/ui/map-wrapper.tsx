import { LocationsMap } from './locations-map';
import type { Location } from '../model/types';

interface MapWrapperProps {
  locations: Location[];
  isLoading?: boolean;
}

export function MapWrapper({ locations, isLoading }: MapWrapperProps) {
  return <LocationsMap locations={locations} isLoading={isLoading} />;
}
