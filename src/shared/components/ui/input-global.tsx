import { Input } from './input';
import clsx from 'clsx';
import type { InputHTMLAttributes } from 'react';

export type InputGlobalProps = InputHTMLAttributes<HTMLInputElement>;

export function InputGlobal(props: InputGlobalProps) {
  return (
    <Input
      {...props}
      className={clsx(
        'h-11 border border-secondary/40 focus-visible:border-secondary focus-visible:ring-0 bg-secondary/5 focus:bg-background transition-all px-3 text-base text-foreground',
        props.className
      )}
    />
  );
}
