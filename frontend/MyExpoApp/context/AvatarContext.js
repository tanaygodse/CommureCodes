// context/AvatarContext.js
import React, { createContext, useState } from 'react';

export const AvatarContext = createContext({
  avatar: null,
  setAvatar: () => {},
});

export function AvatarProvider({ children }) {
  // initial avatar
  const [avatar, setAvatar] = useState(
    require('../assets/avatar_boy1.png')
  );

  return (
    <AvatarContext.Provider value={{ avatar, setAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
}
