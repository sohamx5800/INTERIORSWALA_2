export interface ProjectConcept {
  theme: string;
  colorPalette: string[];
  keyFeatures: string[];
  materials: string[];
  description: string;
  designPlan: string[];
}

export interface QuotationRequest {
  id?: number;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
  aiConcept?: string;
  createdAt?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface SiteProfile {
  phone: string;
  email: string;
  address: string;
  socialLinks: SocialLink[];
}
