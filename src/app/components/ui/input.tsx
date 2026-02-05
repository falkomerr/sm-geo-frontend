import { cn } from '@app/lib/utils';
import * as React from 'react';
import { useState } from 'react';

function Input({
  className,
  type,
  icon,
  iconPosition = 'right',
  label,
  labelClassName,
  error,
  ...props
}: React.ComponentProps<'input'> & {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  label?: string;
  labelClassName?: string;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const input = (
    <input
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      data-slot='input'
      className={cn(
        'flex h-full w-full bg-transparent py-1 text-sm outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-50',
        iconPosition === 'left' ? 'pl-10' : 'pr-10',
        !icon && 'px-0',
        className,
      )}
      {...props}
    />
  );

  if (!icon && !label && type !== 'password' && !error) {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-[16px] border border-black/20 bg-white px-4 py-5 text-sm outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 bg-red-50',
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div className='flex w-full flex-col'>
      <label
        className={cn(
          'relative flex h-12 w-full items-center rounded-[16px] border px-4 py-0',
          error ? 'border-red-500 bg-red-50' : 'border-black/20 bg-white',
          labelClassName
        )}
      >
        {label && (
          <span className={cn('text-xs font-medium', error ? 'text-red-600' : 'text-black/40')}>
            {label}
          </span>
        )}
        <div className='flex w-full items-center gap-x-1'>
          {input}
          {icon && (
            <div
              className={cn(
                'flex h-full items-center text-lg text-black',
                iconPosition === 'left' && 'absolute left-4',
                iconPosition === 'right' && 'absolute right-4'
              )}
            >
              {type === 'password' && (
                <button
                  type='button'
                  className='text-xl'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              )}
              {icon}
            </div>
          )}
        </div>
      </label>
      {error && <span className='mt-1 text-sm text-red-600'>{error}</span>}
    </div>
  );
}

export { Input };
