import { Textarea } from './ui/textarea';
import clsx from 'clsx';
import type { TextareaHTMLAttributes } from 'react';

export type TextareaGlobalProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextareaGlobal(props: TextareaGlobalProps) {
  return (
    <Textarea
      {...props}
      className={clsx(
        'h-11 border border-gray-400/40 focus-visible:border-gray-400 focus-visible:ring-0 bg-gray-500/5 focus:bg-background transition-all px-3 text-base text-foreground',
        props.className
      )}
    />
  );
}
