import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';

// Importa nosso novo componente de dropdown
import BlockFormatDropDown from './toolbar/BlockFormatDropDown';

import './Toolbar.css';
import FontDropDown from './font/FontDropDown';
import ImagePlugin from './image/ImagePlugin';

// Este componente é para os botões de formatação de texto (Bold, Italic, etc)
function TextFormatButtons() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);

    const update = () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
        }
    };

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            update();
        });
    }, [editor]);


    return (
        <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            className={`toolbar-item ${isBold ? 'active' : ''}`}
            aria-label="Format Bold"
        >
            B
        </button>
    );
}


export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);

  const updateToolbar = () => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
    }
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor]);

  return (
    <div className="toolbar">
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={`toolbar-item-bold ${isBold ? 'active' : ''}`}
        aria-label="Format Bold"
      >
        B
      </button>
      <BlockFormatDropDown/>
      <FontDropDown />
      <ImagePlugin/>
      
    </div>
  );
}