// context/AvatarContext.js
import React, { createContext, useState } from 'react';
export const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [avatar, setAvatar] = useState(require('../assets/avatar_boy1.png'));
  const [points, setPoints] = useState(100);
  const [ownedCostumes, setOwnedCostumes] = useState(() => {
    // pre-own free costumes
    const freeIds = ['1'];
    return new Set(freeIds);
  });

  return (
    <AvatarContext.Provider
      value={{ avatar, setAvatar, points, setPoints, ownedCostumes, setOwnedCostumes }}
    >
      {children}
    </AvatarContext.Provider>
  );
}
