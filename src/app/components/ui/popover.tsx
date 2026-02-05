import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';
import { cn } from '@app/lib/utils';

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot='popover' {...props} />;
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  noAnimation,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & { noAnimation?: boolean }) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (noAnimation && contentRef.current) {
      const element = contentRef.current;
      element.style.setProperty('animation', 'none', 'important');
      element.style.setProperty('transition', 'none', 'important');
      element.style.setProperty('transform', 'none', 'important');

      const observer = new MutationObserver(() => {
        if (element.style.animation !== 'none') {
          element.style.setProperty('animation', 'none', 'important');
        }
        if (element.style.transition !== 'none') {
          element.style.setProperty('transition', 'none', 'important');
        }
      });

      observer.observe(element, {
        attributes: true,
        attributeFilter: ['style', 'class'],
      });

      return () => observer.disconnect();
    }
  }, [noAnimation]);

  return (
    <PopoverPrimitive.Content
      ref={contentRef}
      data-slot='popover-content'
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'bg-popover text-popover-foreground z-[9999] w-fit rounded-[20px] p-5 outline-hidden',
        !noAnimation &&
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-popover-content-transform-origin]',
        noAnimation && '!transform-none !animate-none !transition-none',
        className,
      )}
      style={
        noAnimation
          ? {
              animation: 'none !important',
              transition: 'none !important',
              transform: 'none !important',
              ...props.style,
            }
          : props.style
      }
      {...props}
    />
  );
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot='popover-anchor' {...props} />;
}

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
