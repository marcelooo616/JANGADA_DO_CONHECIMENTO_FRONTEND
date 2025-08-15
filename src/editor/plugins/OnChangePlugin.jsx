import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

// Este plugin não será usado por enquanto, para nos ajudar a debugar o erro de foco,
// mas vamos deixá-lo pronto para quando resolvermos o bug do "UpdateOnBlur".
export default function OnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener((listener) => {
      const editorStateAsJSON = JSON.stringify(listener.editorState.toJSON());
      onChange(editorStateAsJSON);
    });
  }, [editor, onChange]);

  return null;
}