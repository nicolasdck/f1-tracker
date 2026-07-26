import { ReactNode, forwardRef } from 'react';

export const Card = forwardRef<
	HTMLDivElement,
	{ children: ReactNode; className?: string }
>(function Card({ children, className = '' }, ref) {
	return (
		<div
			ref={ref}
			className={`rounded bg-black/15 ${className}`}
		>
			{children}
		</div>
	);
});
