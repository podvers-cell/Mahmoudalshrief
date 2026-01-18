import { Project, Service, Package, Testimonial } from './types';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'Work', path: '/work' },
  { name: 'Packages', path: '/packages' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Brand Videography',
    category: 'videography',
    description: 'High-end commercial shooting for brands, products, and corporate events.',
    features: ['4K Cinema Cameras', 'Professional Lighting', 'Direction & Styling', 'Multi-cam setup'],
    startingPrice: '3,500 AED',
    iconName: 'Camera',
  },
  {
    id: 's2',
    title: 'Post-Production',
    category: 'editing',
    description: 'Advanced editing, color grading, and sound design to craft the perfect narrative.',
    features: ['Davinci Resolve Grading', 'Sound Design & Mixing', 'Motion Graphics', 'Fast Turnaround'],
    startingPrice: '1,500 AED',
    iconName: 'Scissors',
  },
  {
    id: 's3',
    title: 'Creative Consultation',
    category: 'consultation',
    description: 'Strategy sessions to plan your content roadmap and visual identity.',
    features: ['Content Strategy', 'Script Development', 'Shoot Planning', 'Brand Guidelines'],
    startingPrice: '1,000 AED',
    iconName: 'Lightbulb',
  },
];

export const PACKAGES: Package[] = [
  {
    id: 'p1',
    name: 'Social Starter',
    price: '4,500 AED / mo',
    description: 'Perfect for personal brands needing consistent social presence.',
    features: ['4 Reels / Shorts per month', '1 Shoot Day (4 hours)', 'Basic Motion Graphics', 'Licensed Music', 'Social formatting (9:16)'],
  },
  {
    id: 'p2',
    name: 'Growth Partner',
    price: '9,000 AED / mo',
    description: 'Comprehensive content solution for growing businesses.',
    features: ['8 Reels / Shorts per month', '2 Shoot Days', '1 Hero Video (Landscape)', 'Advanced Color Grade', 'Strategy Call', 'Thumbnail Design'],
    isPopular: true,
  },
  {
    id: 'p3',
    name: 'Event Coverage',
    price: '5,000 AED',
    description: 'Full day coverage for corporate or launch events.',
    features: ['Up to 8 Hours On-site', 'Highlight Reel (2-3 mins)', 'Full Speeches (Separate)', '2 Videographers', '48h Teaser Delivery'],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'pr1',
    title: 'Neon Drift',
    category: 'Commercial',
    year: '2024',
    client: 'AutoX Dubai',
    image: 'https://picsum.photos/id/133/800/600',
    role: ['Director', 'Editor'],
    description: 'A high-energy commercial featuring night drifting sequences. The goal was to capture the raw power and neon aesthetics of Dubai car culture.',
    deliverables: ['30s TV Spot', 'Social Cutdowns'],
  },
  {
    id: 'pr2',
    title: 'Urban Fashion',
    category: 'Product',
    year: '2023',
    client: 'Vogue Arab',
    image: 'https://picsum.photos/id/338/800/600',
    role: ['DoP', 'Colorist'],
    description: 'Editorial fashion film shot in downtown Dubai. Focusing on fabric textures and urban backdrops.',
    deliverables: ['Lookbook Video', 'Instagram Reels'],
  },
  {
    id: 'pr3',
    title: 'Tech Summit 24',
    category: 'Events',
    year: '2024',
    client: 'FutureTech',
    image: 'https://picsum.photos/id/3/800/600',
    role: ['Lead Videographer'],
    description: 'Comprehensive coverage of a 3-day tech conference with over 5000 attendees.',
    deliverables: ['Event Highlight', 'Keynote Recordings'],
  },
  {
    id: 'pr4',
    title: 'Chef\'s Table',
    category: 'Lifestyle',
    year: '2023',
    client: 'Al-Mina Resort',
    image: 'https://picsum.photos/id/225/800/600',
    role: ['Director', 'Editor'],
    description: 'An intimate look into the kitchen of a Michelin star chef.',
    deliverables: ['Mini Documentary', 'Social Teasers'],
  },
  {
    id: 'pr5',
    title: 'Fitness Pro',
    category: 'Social',
    year: '2024',
    client: 'GymNation',
    image: 'https://picsum.photos/id/73/800/600',
    role: ['Editor'],
    description: 'High-paced workout edits synced to upbeat tracks for maximum engagement.',
    deliverables: ['10 TikTok edits'],
  },
  {
    id: 'pr6',
    title: 'Real Estate Luxury',
    category: 'Commercial',
    year: '2024',
    client: 'Emaar',
    image: 'https://picsum.photos/id/122/800/600',
    role: ['Drone Operator', 'Editor'],
    description: 'Showcasing a new penthouse listing with FPV drone tours and interior steady-cam shots.',
    deliverables: ['Property Tour', 'Instagram Reels'],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Jenkins',
    role: 'Marketing Director',
    company: 'TechFlow',
    text: 'Mahmoud transformed our brand image. His eye for detail and cinematic approach made our simple corporate video look like a movie.',
  },
  {
    id: 't2',
    name: 'Omar Al-Fayed',
    role: 'Founder',
    company: 'Oasis Real Estate',
    text: 'Professional, fast, and incredibly creative. The content he produced doubled our social engagement in one month.',
  },
  {
    id: 't3',
    name: 'Jessica Lee',
    role: 'Event Coordinator',
    company: 'Dubai Expo Team',
    text: 'Capturing the energy of a live event is hard, but Mahmoud nailed it. The highlight reel is pure gold.',
  },
];
