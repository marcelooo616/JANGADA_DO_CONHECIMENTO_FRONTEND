import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState, useRef, useCallback } from 'react';
// MUDANÇA: $createParagraphNode importado do pacote 'lexical'
import { $getSelection, $isRangeSelection, $isRootOrShadowRoot, $createParagraphNode } from 'lexical';
import { $findMatchingParent, $getNearestNodeOfType } from '@lexical/utils';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, $isListNode, ListNode } from '@lexical/list';
// MUDANÇA: $createParagraphNode removido deste import
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode, $isCodeNode } from '@lexical/code';

// ... outros imports do lexical
import { ListPlugin } from '@lexical/react/LexicalListPlugin'; // <<-- ADICIONE ESTA LINHA
// ...

const blockTypeToBlockName = {
  bullet: 'Lista',
  code: 'Bloco de Código',
  h1: 'Título 1',
  h2: 'Título 2',
  h3: 'Título 3',
  number: 'Lista Numerada',
  paragraph: 'Normal',
  quote: 'Citação',
};

export default function BlockFormatDropDown() {
  const [editor] = useLexicalComposerContext();
  const dropDownRef = useRef(null);
  const [blockType, setBlockType] = useState('paragraph');
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
    setShowBlockOptionsDropDown(false);
  };

  // ... o resto do arquivo permanece exatamente o mesmo ...
  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
    setShowBlockOptionsDropDown(false);
  };

const formatBulletList = () => {
    // Se o bloco atual não for 'bullet', aplica o comando para criar a lista.
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      // Se já for 'bullet', remove a formatação de lista.
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    // Fecha a dropdown após a ação
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    // Se o bloco atual não for 'number', aplica o comando para criar a lista.
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      // Se já for 'number', remove a formatação de lista.
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
    // Fecha a dropdown após a ação
    setShowBlockOptionsDropDown(false);
  };
  

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getListType() : element.getListType();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        if (type in blockTypeToBlockName) {
          setBlockType(type);
        }
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);
  
  useEffect(() => {
    const dropdown = dropDownRef.current;
    if (dropdown) {
      const handleOutsideClick = (event) => {
        if (!dropdown.contains(event.target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [dropDownRef]);

  return (
    <div className="dropdown-wrapper" ref={dropDownRef}>
      <button
        type="button"
        className="toolbar-item block-controls"
        onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
        aria-label="Formatting Options"
      >
        <span className="text">{blockTypeToBlockName[blockType]}</span>
        <i className="chevron-down" />
      </button>

      {showBlockOptionsDropDown && (
        <div className="dropdown">
          <button type="button" className="item" onClick={formatParagraph}>Normal</button>
          <button type="button" className="item" onClick={() => formatHeading('h1')}>Título 1</button>
          <button type="button" className="item" onClick={() => formatHeading('h2')}>Título 2</button>
          <button type="button" className="item" onClick={() => formatHeading('h3')}>Título 3</button>
          <button type="button" className="item" onClick={formatBulletList}>Lista</button>
          <button type="button" className="item" onClick={formatNumberedList}>Lista Numerada</button>
          <button type="button" className="item" onClick={formatQuote}>Citação</button>
          <button type="button" className="item" onClick={formatCode}>Bloco de Código</button>
        </div>
      )}
    </div>
  );
}