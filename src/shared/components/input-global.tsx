import { Input } from './ui/input';
import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

export type InputGlobalProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function InputGlobal({ error, ...props }: InputGlobalProps) {
  return (
    <Input
      {...props}
      className={clsx(
        'h-11 border border-gray-400/40 focus-visible:border-gray-400 focus-visible:ring-0 bg-gray-500/5 focus:bg-background transition-all px-3 text-base text-foreground',
        error && 'border-red-500'
      )}
    />
  );
}
