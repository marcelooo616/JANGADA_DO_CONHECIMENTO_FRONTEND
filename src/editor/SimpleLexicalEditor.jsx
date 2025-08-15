import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
// MUDANÇA: Importamos forwardRef e useImperativeHandle
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';


import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode } from '@lexical/code'

import ToolbarPlugin from './plugins/ToolbarPlugin.jsx';
import InitialContentPlugin from './plugins/InitialContentPlugin.jsx';
import ImagePlugin from './plugins/image/ImagePlugin.jsx';
import { ImageNode } from './nodes/ImageNode.jsx';



const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  code: 'editor-code',
  text: {
    bold: 'editor-text-bold',
    // Adicionaremos mais aqui no futuro (itálico, etc.)
  },
};

const editorConfig = {
  namespace: 'MyEditor',
  theme: theme, // O seu objeto de tema
  onError: (error) => console.error(error),
  // --- ADICIONE OS NOVOS NÓS AQUI ---
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    ImageNode,
  ],
};





// MUDANÇA: Envolvemos o componente com forwardRef
export const SimpleLexicalEditor = forwardRef(({ initialContent, themeMode }, ref) => {
  const [editor, setEditor] = useState(null);

  const editorRef = (node) => {
    setEditor(node);
  };

  // MUDANÇA: useImperativeHandle expõe uma função para o componente pai
  useImperativeHandle(ref, () => ({
    getEditorStateJSON: () => {
      if (editor) {
        const editorState = editor.getEditorState();
        return JSON.stringify(editorState.toJSON());
      }
      return null; // Retorna null se o editor não estiver pronto
    },
  }));
  
  // Usamos um truque para capturar a instância do editor
  function EditorCapturePlugin() {
    const [editorInstance] = useLexicalComposerContext();
    useEffect(() => {
      setEditor(editorInstance);
    }, [editorInstance]);
    return null;
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
       <div className={`editor-container ${themeMode === 'dark' ? 'dark' : 'light'}`}>
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            ErrorBoundary={LexicalErrorBoundary}
          />
            <ListPlugin />
          <HistoryPlugin />
          <InitialContentPlugin initialContent={initialContent} />
          <EditorCapturePlugin />
           
        </div>
      </div>
    </LexicalComposer>
  );
});