import clsx from 'clsx';
import type { SelectHTMLAttributes } from 'react';

export type SelectGlobalProps = SelectHTMLAttributes<HTMLSelectElement>;

export function SelectGlobal(props: SelectGlobalProps) {
  return (
    <select
      {...props}
      className={clsx(
        'h-11 border border-secondary/40 focus-visible:border-secondary focus-visible:ring-0 bg-secondary/5 focus:bg-background transition-all rounded-md px-3 text-base text-foreground',
        props.className
      )}
    />
  );
}
