// src/pages/LexicalRenderer.jsx

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

// Importe TODOS os nós que você usa no seu editor, incluindo os customizados
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode } from '@lexical/code';
// --- O IMPORT MAIS IMPORTANTE ---
import { ImageNode } from '../editor/nodes/ImageNode.jsx'; // Ajuste o caminho se necessário

// Este arquivo de estilo é importante para a aparência do conteúdo
import './LexicalRenderer.css'; 

// Configuração do editor para o renderizador
const editorConfig = {
  namespace: 'LexicalRenderer',
  editable: false, // <<-- MODO SOMENTE LEITURA, crucial
  theme: {
    // Copie o mesmo objeto 'theme' do seu SimpleLexicalEditor.jsx
    // para garantir que as classes CSS sejam consistentes.
    paragraph: 'editor-paragraph',
    quote: 'editor-quote',
    heading: {
      h1: 'editor-heading-h1',
      h2: 'editor-heading-h2',
      h3: 'editor-heading-h3',
    },
    list: {
      ol: 'editor-list-ol',
      ul: 'editor-list-ul',
      listitem: 'editor-listitem',
    },
    code: 'editor-code',
    text: {
      bold: 'editor-text-bold',
      italic: 'editor-text-italic',
    },
    // Adicione a classe para a imagem, que será usada pelo ImageComponent
    image: 'editor-image-wrapper', 
  },
  onError: (error) => {
    console.error("Erro no LexicalRenderer:", error);
  },
  // --- REGISTRA TODOS OS NÓS NECESSÁRIOS ---
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    ImageNode, // <<-- Registra o nó de imagem para que ele seja reconhecido
  ],
};

function LexicalRenderer({ jsonContent }) {
  if (!jsonContent) return null;

  return (
    // O LexicalComposer cria o ambiente do editor
    <LexicalComposer initialConfig={{ ...editorConfig, editorState: jsonContent }}>
      <div className="lexical-renderer-container">
        {/* O RichTextPlugin é responsável por renderizar os nós */}
        <RichTextPlugin
          contentEditable={<ContentEditable className="renderer-content-editable" />}
          placeholder={null} // Não precisamos de placeholder na visualização
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
    </LexicalComposer>
  );
}

export default LexicalRenderer;