import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

const STORAGE_KEY = "gemini_api_key";

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  hasKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | null>(null);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!apiKey) {
      setShowModal(true);
    }
  }, [apiKey]);

  const setApiKey = (key: string) => {
    localStorage.setItem(STORAGE_KEY, key);
    setApiKeyState(key);
  };

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
        showModal,
        setShowModal,
        hasKey: !!apiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey(): ApiKeyContextType {
  const ctx = useContext(ApiKeyContext);
  if (!ctx) throw new Error("useApiKey must be used within ApiKeyProvider");
  return ctx;
}
