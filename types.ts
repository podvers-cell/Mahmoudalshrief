export type ServiceCategory = 'videography' | 'editing' | 'consultation';

export interface Service {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  features: string[];
  startingPrice: string;
  iconName: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  videoUrl?: string; // Placeholder for embedded video
  client: string;
  role: string[];
  description: string;
  deliverables: string[];
}

export interface Package {
  id: string;
  name: string;
  price: string; // e.g., "5,000 AED"
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  image?: string;
}

export interface BookingState {
  serviceType: ServiceCategory | '';
  packageId: string | 'custom' | '';
  date: string;
  time: string;
  details: {
    name: string;
    email: string;
    phone: string;
    company: string;
    brief: string;
    budget: string;
  };
}