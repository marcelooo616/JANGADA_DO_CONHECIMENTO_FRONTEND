import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createCommand, $getSelection, $isRangeSelection } from 'lexical';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Usaremos para feedback de upload
import { useAuth } from '../../../context/AuthContext'; // Importa o useAuth para pegar o token
import { $createImageNode } from '../../nodes/ImageNode.jsx';
import './ImagePlugin.css'; // Criaremos este arquivo para o estilo do modal

// Suas funções de API (ajustadas para o contexto do plugin)
const API_URL = 'https://137.131.212.103/api';

const imageUploadHandler = (token, file) => {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file, file.name);

        axios.post(`${API_URL}/upload-image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // A resposta (response.data) é um objeto: { location: "..." }
            // Acessamos a URL diretamente com response.data.location
            const locationUrl = response.data?.location;

            if (locationUrl) {
                // Se a URL existe, a Promise é resolvida com sucesso!
                resolve(locationUrl);
            } else {
                // Se não houver a propriedade 'location', rejeitamos.
                reject('Formato de resposta da API inválido. Propriedade "location" não encontrada.');
            }
        })
        .catch(error => {
            const errorMessage = error.response?.data?.message || error.message;
            reject('Falha no upload da imagem: ' + errorMessage);
        });
    });
};

export const INSERT_IMAGE_COMMAND = createCommand();

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  const { token } = useAuth(); // Pega o token do contexto de autenticação

  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const fileInputRef = useRef(null);
  const lastSelectionRef = useRef(null);

   useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const selection = lastSelectionRef.current || editor.getEditorState().read($getSelection);
        
        editor.update(() => {
          // Garante que o editor tenha o foco antes de qualquer ação
          editor.focus();
          
          if (selection && $isRangeSelection(selection)) {
            const imageNode = $createImageNode(payload);
            selection.insertNodes([imageNode]);
          } else {
            // Fallback: se a seleção for perdida, insere no final
            const root = editor.getRoot();
            const imageNode = $createImageNode(payload);
            root.append(imageNode);
          }
        });
        return true;
      },
      0,
    );
  }, [editor]);

   const openModal = () => {
    // Guarda a seleção atual ANTES de mostrar o modal
    lastSelectionRef.current = editor.getEditorState().read($getSelection);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    // Devolve o foco para o editor assim que o modal fecha
    editor.focus();
  };

  const handleInsertFromUrl = () => {
    if (url) {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: url, altText: 'Imagem inserida por URL' });
      closeModal(); // Usa a nova função para fechar
      setUrl('');
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file && token) {
      const uploadToastId = toast.loading("Fazendo upload da imagem...");
      try {
        const imageUrl = await imageUploadHandler(token, file);
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: imageUrl, altText: file.name });
        toast.update(uploadToastId, { render: "Upload concluído!", type: "success", isLoading: false, autoClose: 3000 });
      } catch (error) {
        toast.update(uploadToastId, { render: `Erro no upload: ${error}`, type: "error", isLoading: false, autoClose: 5000 });
      }
      closeModal(); 
    }
  };

  return (
    <>
      <button  type="button"  onClick={openModal}  aria-label="Inserir Imagem">
         <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="9" cy="9" r="2"></circle>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
  </svg>
      </button>

      {showModal && (
        <div className="insert-image-overlay">
          <div className="insert-image-modal">
            <div className="insert-image-header">
              <h3 className="insert-image-title">Adicionar Imagem</h3>
              <button onClick={closeModal} className="insert-image-close-btn">&times;</button>
            </div>

            <div className="insert-image-body">
              {/* --- Seção de Upload --- */}
              <div className="insert-image-option">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    id="file-upload-input"
                    style={{ display: 'none' }}
                />
                <label htmlFor="file-upload-input" className="insert-image-upload-area">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>Clique para fazer upload ou arraste e solte</span>
                    <small>PNG, JPG, GIF até 10MB</small>
                </label>
              </div>

              <div className="insert-image-divider">
                <span>OU</span>
              </div>

              {/* --- Seção de URL --- */}
              <div className="insert-image-option">
                <label htmlFor="image-url-input">Inserir a partir de uma URL</label>
                <div className="insert-image-url-group">
                  <input
                    id="image-url-input"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Cole o link da imagem aqui"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleInsertFromUrl(); }}
                  />
                  <button type="button" onClick={handleInsertFromUrl} className="insert-image-url-btn">
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}