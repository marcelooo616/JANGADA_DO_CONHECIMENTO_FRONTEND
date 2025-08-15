import { useState, useEffect } from 'react';

// Este hook recebe um valor (o que o usuário está digitando) e um delay (tempo de espera)
function useDebounce(value, delay) {
  // Estado para guardar o valor "atrasado" (debounced)
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura um cronômetro (timer) para atualizar o valor debounced depois do delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // IMPORTANTE: Limpa o cronômetro anterior cada vez que o 'value' (digitação) muda.
    // Isso garante que só o último timer (depois da pausa) seja executado.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Roda o efeito de novo apenas se o valor ou o delay mudarem

  return debouncedValue;
}

export default useDebounce;