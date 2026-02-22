export interface ProjectConcept {
  theme: string;
  colorPalette: string[];
  keyFeatures: string[];
  materials: string[];
  description: string;
  designPlan: string[];
}

export interface QuotationRequest {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
}
