'use client';

import { AIChatPlugin } from '@platejs/ai/react';
import { BlockSelectionPlugin } from '@platejs/selection/react';
import { getPluginTypes, isHotkey, KEYS, createSlateEditor, type TElement, type TText } from 'platejs';

import { BlockSelection } from '@/components/ui/block-selection';
import { BaseEditorKit } from '@/components/editor/editor-base-kit';

// Helper function to extract text from Slate nodes
function getNodeString(node: any): string {
  if ('text' in node) {
    return (node as TText).text;
  }

  if ('children' in node) {
    return (node as TElement).children
      .map((child) => getNodeString(child))
      .join('');
  }

  return '';
}

export const BlockSelectionKit = [
  BlockSelectionPlugin.configure(({ editor }) => ({
    options: {
      enableContextMenu: true,
      isSelectable: (element) => {
        return !getPluginTypes(editor, [
          KEYS.column,
          KEYS.codeLine,
          KEYS.td,
        ]).includes(element.type);
      },
      onKeyDownSelecting: (editor, e) => {
        if (isHotkey('mod+j')(e)) {
          editor.getApi(AIChatPlugin).aiChat.show();
          return;
        }

        // Handle Cmd+C (copy) for block selection
        if (isHotkey('mod+c')(e)) {
          e.preventDefault();

          const selectedBlocks = editor
            .getApi(BlockSelectionPlugin)
            .blockSelection.getNodes();

          if (selectedBlocks.length === 0) return;

          // Extract nodes from the selection
          const nodes = selectedBlocks.map(([node]) => node);

          // Create a temporary editor to serialize the selected content
          const tempEditor = createSlateEditor({
            plugins: BaseEditorKit,
            value: nodes,
          });

          // Serialize to plain text using Slate's built-in method
          const plainText = nodes
            .map((node) => {
              try {
                return getNodeString(node);
              } catch {
                return '';
              }
            })
            .filter(Boolean)
            .join('\n\n');

          // Serialize to a basic HTML representation
          const htmlContent = nodes
            .map((node) => {
              const text = getNodeString(node);
              const type = (node as any).type || 'p';
              return `<${type}>${text}</${type}>`;
            })
            .join('');

          // Copy to clipboard using modern Clipboard API
          if (navigator.clipboard && window.ClipboardItem) {
            const clipboardItem = new ClipboardItem({
              'text/plain': new Blob([plainText], { type: 'text/plain' }),
              'text/html': new Blob([htmlContent], { type: 'text/html' }),
            });

            navigator.clipboard.write([clipboardItem]).catch((err) => {
              console.error('Failed to copy:', err);
              // Fallback to simple text copy
              navigator.clipboard.writeText(plainText);
            });
          } else {
            // Fallback for older browsers
            navigator.clipboard.writeText(plainText);
          }

          return;
        }

        // Handle Cmd+X (cut) for block selection
        if (isHotkey('mod+x')(e)) {
          e.preventDefault();

          const selectedBlocks = editor
            .getApi(BlockSelectionPlugin)
            .blockSelection.getNodes();

          if (selectedBlocks.length === 0) return;

          // Extract nodes for clipboard
          const nodes = selectedBlocks.map(([node]) => node);

          // Create a temporary editor to serialize
          const tempEditor = createSlateEditor({
            plugins: BaseEditorKit,
            value: nodes,
          });

          // Serialize to plain text
          const plainText = nodes
            .map((node) => {
              try {
                return getNodeString(node);
              } catch {
                return '';
              }
            })
            .filter(Boolean)
            .join('\n\n');

          const htmlContent = nodes
            .map((node) => {
              const text = getNodeString(node);
              const type = (node as any).type || 'p';
              return `<${type}>${text}</${type}>`;
            })
            .join('');

          // Copy to clipboard
          if (navigator.clipboard && window.ClipboardItem) {
            const clipboardItem = new ClipboardItem({
              'text/plain': new Blob([plainText], { type: 'text/plain' }),
              'text/html': new Blob([htmlContent], { type: 'text/html' }),
            });

            navigator.clipboard.write([clipboardItem]).catch((err) => {
              console.error('Failed to cut:', err);
              navigator.clipboard.writeText(plainText);
            });
          } else {
            navigator.clipboard.writeText(plainText);
          }

          // Remove the selected blocks
          editor
            .getTransforms(BlockSelectionPlugin)
            .blockSelection.removeNodes();

          return;
        }
      },
    },
    render: {
      belowRootNodes: (props) => {
        if (!props.attributes.className?.includes('slate-selectable'))
          return null;

        return <BlockSelection {...(props as any)} />;
      },
    },
  })),
];
