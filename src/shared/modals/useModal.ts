const useModal = (key: string) => {
  const open = (params?: Record<string, any>) => openModal({ key, params });
  const close = () => closeModal(key);

  return { open, close };
};

export default useModal;
