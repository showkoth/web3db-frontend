'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => null,
});

export function SplineHero({ scene }: { scene: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Spline scene={scene} className="h-full w-full" />
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
