/**
 * Device type definitions - Interface Segregation Principle
 * Her interface minimal ve spesifik sorumluluk taşır
 */

export interface Device {
  id: string;
  name: string;
  category: string;
  weight?: number;
  condition?: 'good' | 'moderate' | 'poor';
}

export interface DeviceInputDto {
  name: string;
  category: string;
  weight?: number;
  condition?: 'good' | 'moderate' | 'poor';
}

export interface MultiDeviceSubmission {
  devices: Device[];
  totalWeight: number;
  submissionDate: Date;
}
