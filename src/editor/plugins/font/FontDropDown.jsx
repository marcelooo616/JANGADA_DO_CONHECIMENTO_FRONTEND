// src/editor/plugins/FontDropDown.jsx

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState, useRef } from 'react';
import { $getSelection, $isRangeSelection } from 'lexical';

// NOVO IMPORT: Uma função do Lexical feita exatamente para isso!
import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection';

// Lista de fontes que vamos oferecer na dropdown
const FONT_FAMILY_OPTIONS = [
  ['Inter', 'Inter'],
  ['Lato', 'Lato'],
  ['Montserrat', 'Montserrat'],
  ['Roboto', 'Roboto'],
  ['Merriweather', 'Merriweather'],
  ['Lora', 'Lora'],
  ['Playfair Display', 'Playfair Display'],
  ['Fira Code', 'Fira Code'],
  
];

import './FontDropDown.css';

export default function FontDropDown() {
  const [editor] = useLexicalComposerContext();
  const dropDownRef = useRef(null);
  const [showFontDropDown, setShowFontDropDown] = useState(false);
  
  const [fontFamily, setFontFamily] = useState('Roboto');

  const onFontFamilySelect = useCallback((newFontFamily) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // A função $patchStyleText é inteligente. 
        // Ela aplica o estilo ao texto selecionado (se houver) OU
        // define o estilo para o próximo texto a ser digitado (se o cursor estiver apenas posicionado).
        $patchStyleText(selection, { 'font-family': newFontFamily });
      }
    });
    setShowFontDropDown(false);
  }, [editor]);

  // Efeito para fechar a dropdown ao clicar fora
  useEffect(() => {
    const dropdown = dropDownRef.current;
    if (dropdown) {
      const handleOutsideClick = (event) => {
        if (!dropdown.contains(event.target)) {
          setShowFontDropDown(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [dropDownRef]);

  // Efeito para atualizar a fonte exibida na toolbar conforme o cursor se move
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // LÓGICA CORRIGIDA: Usa a função do Lexical para ler o estilo de forma precisa
          const currentFontFamily = $getSelectionStyleValueForProperty(selection, 'font-family', 'Roboto');
          setFontFamily(currentFontFamily);
        }
      });
    });
  }, [editor]);

  return (
    <div className="dropdown-wrapper" ref={dropDownRef}>
      <button
        type="button"
        className="toolbar-item"
        onClick={() => setShowFontDropDown(!showFontDropDown)}
        aria-label="Opções de Fonte"
      >
        <i className="fas fa-font" style={{ marginRight: '8px' }} />
        <span className="text">{fontFamily}</span>
        <i className="chevron-down" />
      </button>

      {showFontDropDown && (
        <div className="dropdown">
          {FONT_FAMILY_OPTIONS.map(([value, name]) => (
            <button
              type="button"
              className="item"
              key={value}
              onClick={() => onFontFamilySelect(value)}
            >
              <span className="text" style={{ fontFamily: value }}>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}