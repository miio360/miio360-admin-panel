import { Textarea } from './ui/textarea';
import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';

export type TextareaGlobalProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaGlobal(props: TextareaGlobalProps) {
  return (
    <Textarea
      {...props}
      className={clsx(
        'resize-none text-sm border border-secondary/40 focus-visible:border-secondary focus-visible:ring-0 bg-secondary/5 focus:bg-background transition-all px-3 text-base text-foreground',
        props.className
      )}
    />
  );
}
