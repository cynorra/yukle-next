'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useT } from '@/hooks/useT';
import { TextureCard } from '@/components/ui/texture-card';
import { TextureButton } from '@/components/ui/texture-button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  const t = useT();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <TextureCard className="flex flex-col items-center justify-center py-16 px-4 text-center border-dashed">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
          <div className="relative w-20 h-20 rounded-3xl bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center shadow-2xl">
            <Icon size={40} className="text-accent/40" />
          </div>
        </div>
        
        <h3 className={`text-xl font-black tracking-tight ${t.heading} mb-2`}>
          {title}
        </h3>
        <p className={`max-w-xs text-sm ${t.sub} leading-relaxed mb-8`}>
          {description}
        </p>

        {action && (
          <TextureButton
            onClick={action.onClick}
            variant="accent"
            className="px-8 !rounded-xl"
          >
            {action.icon && <action.icon size={18} className="mr-2 inline" />}
            {action.label}
          </TextureButton>
        )}
      </TextureCard>
    </motion.div>
  );
}
