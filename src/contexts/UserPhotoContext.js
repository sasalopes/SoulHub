
import React, { createContext, useState } from 'react';
import { semFotoPerfil } from '../firebase/auth';

export const UserPhotoContext = createContext();

export const UserPhotoProvider = ({ children }) => {
  const [userPhoto, setUserPhoto] = useState(semFotoPerfil);

  return (
    <UserPhotoContext.Provider value={{ userPhoto, setUserPhoto }}>
      {children}
    </UserPhotoContext.Provider>
  );
};

