export interface BadgeData {
  id: string;
  name: string;
  englishName: string;
  role: string;
  department: string;
  company: string;
  companyEn: string;
  employeeId: string;
  avatarUrl: string;
  accessLevel: string;
  issueDate: string;
  expiryDate: string;
  logoType?: 'minimal' | 'nexus' | 'swiss' | 'studio' | 'apple' | 'openai' | 'custom';
  styleMode?: 'dark' | 'light';
  theme: BadgeTheme;
  customFrontImage?: string | null;
  customBackImage?: string | null;
  customLanyardImage?: string | null;
}

export interface BadgeTheme {
  id: string;
  name: string;
  primaryColor: string; // Subtle accent color
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  subtextColor: string;
  cardBgGradient: [string, string];
  chipColor: 'titanium' | 'silver' | 'gold' | 'stealth';
  lanyardColor: string;
  lanyardTextColor: string;
  strapText?: string;
  borderColor: string;
}

export interface PhysicsSettings {
  gravity: [number, number, number];
  lanyardWidth: number;
  fov: number;
  cameraDistance: number;
}
