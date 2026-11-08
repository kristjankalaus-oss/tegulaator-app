import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'amber';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

    const variants = {
      default: 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm focus-visible:ring-stone-400',
      destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-400',
      outline: 'border border-stone-300 bg-white text-stone-900 hover:bg-stone-100 shadow-sm',
      secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200',
      ghost: 'hover:bg-stone-100 text-stone-700 hover:text-stone-900',
      link: 'text-orange-600 underline-offset-4 hover:underline p-0 h-auto',
      amber: 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm font-semibold focus-visible:ring-orange-400',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-12 rounded-lg px-6 text-base',
      icon: 'h-10 w-10 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
