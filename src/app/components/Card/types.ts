export interface CardProps {
  orientation?: 'vertical' | 'horizontal';
  imageSrc: string;
  label: string;
  title: string;
  description: string;
  onAccept: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}