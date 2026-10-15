import React from 'react';
import { PublicWebsitePage } from './PublicWebsitePage';

export interface HomePageProps {
  onNavigateLogin?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateLogin = () => {} }) => {
  return <PublicWebsitePage onNavigateLogin={onNavigateLogin} />;
};
