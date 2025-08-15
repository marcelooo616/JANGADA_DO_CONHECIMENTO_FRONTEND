import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';

export default function InitialContentPlugin({ initialContent }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (initialContent && !isInitialized.current) {
      isInitialized.current = true;
      try {
        const initialEditorState = editor.parseEditorState(initialContent);
        editor.setEditorState(initialEditorState);
      } catch (error) {
        console.error("Erro ao carregar conteúdo inicial:", error);
      }
    }
  }, [editor, initialContent]);

  return null;
}