import { Monitor, Smartphone, Tablet } from 'lucide-react';

export const EMAIL_TEMPLATE_DEVICE_PRESETS = {
  mobile: { width: '375px', icon: Smartphone, label: 'Mobile' },
  tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
  laptop13: { width: '1280px', icon: Monitor, label: '13" Laptop' },
  laptop14: { width: '1440px', icon: Monitor, label: '14" Laptop' },
  laptop16: { width: '1600px', icon: Monitor, label: '16" Laptop' },
};
