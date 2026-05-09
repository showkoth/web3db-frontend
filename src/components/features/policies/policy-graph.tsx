'use client';

import {
  Background,
  Controls,
  type Edge,
  MarkerType,
  type Node,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';
import type { Policy } from '@/components/features/policies/types';

const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

export function PolicyGraph({ subject, policies }: { subject: string; policies: Policy[] }) {
  const { nodes, edges } = useMemo(() => {
    const objects = Array.from(new Set(policies.map((p) => p.object_address)));
    const subjectNode: Node = {
      id: subject,
      position: { x: 0, y: 0 },
      data: { label: `${short(subject)} (you)` },
      style: {
        background: 'oklch(var(--color-primary))',
        color: 'oklch(var(--color-primary-foreground))',
        border: '1px solid oklch(var(--color-border))',
        borderRadius: 8,
        padding: 8,
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 12,
      },
    };
    const objNodes: Node[] = objects.map((o, i) => ({
      id: o,
      position: { x: 320, y: i * 90 - (objects.length - 1) * 45 },
      data: { label: short(o) },
      style: {
        background: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        padding: 8,
        fontFamily: 'var(--font-geist-mono)',
        fontSize: 12,
      },
    }));
    const edges: Edge[] = policies.map((p, i) => ({
      id: `${p.object_address}-${i}`,
      source: subject,
      target: p.object_address,
      label: p.table_name,
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: 'var(--color-foreground)', opacity: 0.6 },
      labelStyle: { fontSize: 10, fontFamily: 'var(--font-geist-mono)' },
    }));
    return { nodes: [subjectNode, ...objNodes], edges };
  }, [subject, policies]);

  if (!policies.length) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border bg-card text-sm text-muted-foreground">
        No policies granted yet.
      </div>
    );
  }

  return (
    <div className="h-[400px] overflow-hidden rounded-lg border">
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
