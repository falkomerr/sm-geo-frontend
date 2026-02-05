import { axiosInstance } from '../../../../shared/api/axios-instance';

export async function deleteLocation(id: string): Promise<void> {
  await axiosInstance.delete(`/locations/${id}`);
}
