'use client';

import Editor, { type OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  value: string;
  onChange: (next: string) => void;
  onRun?: () => void;
  completions?: { label: string; detail?: string }[];
  height?: number;
};

export function SqlEditor({ value, onChange, onRun, completions = [], height = 220 }: Props) {
  const { resolvedTheme } = useTheme();
  const completionsRef = useRef(completions);
  useEffect(() => {
    completionsRef.current = completions;
  }, [completions]);

  const handleMount: OnMount = (editor, monaco) => {
    monaco.languages.registerCompletionItemProvider('sql', {
      // biome-ignore lint/suspicious/noExplicitAny: monaco types are complex
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: completionsRef.current.map((c) => ({
            label: c.label,
            kind: monaco.languages.CompletionItemKind.Field,
            insertText: c.label,
            detail: c.detail,
            range,
          })),
        };
      },
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRun?.());
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <Editor
        height={height}
        defaultLanguage="sql"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        onMount={handleMount}
        theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
        loading={<Skeleton className="h-full w-full" />}
        options={{
          fontSize: 13,
          fontFamily:
            'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 12, bottom: 12 },
          smoothScrolling: true,
          fixedOverflowWidgets: true,
        }}
      />
    </div>
  );
}
