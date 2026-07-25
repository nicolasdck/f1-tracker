import { ReactNode, forwardRef } from 'react';

export const Card = forwardRef<
	HTMLDivElement,
	{ children: ReactNode; className?: string }
>(function Card({ children, className = '' }, ref) {
	return (
		<div
			ref={ref}
			className={`rounded border border-white/8 bg-white/[0.03] ${className}`}
		>
			{children}
		</div>
	);
});
