// context/AvatarContext.js
import React, { createContext, useState } from 'react';
export const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [avatar, setAvatar] = useState(require('../assets/avatar_boy1.png'));
  const [points, setPoints] = useState(150);
  const [ownedCostumes, setOwnedCostumes] = useState(() => {
    // pre-own free costumes
    const freeIds = ['1'];
    return new Set(freeIds);
  });
  const [taskMap, setTaskMap] = useState({
    1: {
        task: "take medicine",
        story: "You must consume your power elixir to stay strong.",
        completed: false,
        startTime: "08:00",
        endTime: "10:00",
        points: 10
    },
    2: {
        task: "stretching",
        story: "Time to stretch your limbs and prepare for the space mission!",
        completed: false,
        startTime: "10:00", 
        endTime: "12:00",
        points: 10
    },
    3: {
        task: "drink water",
        story: "Hydration shields are low! Refill with space water now.",
        completed: false,
        startTime: "12:00",
        endTime: "14:00",
        points: 10
    }, 
    4: {
        task: "Get a CT Scan",
        story: "The shields need to be strengthed with the power of magnets, meet up with chief for a CT scan.",
        completed: false,
        startTime: "14:00",
        endTime: "16:00",
        points: 100
    },
    5: {
        task: "eat salad",
        story: "After a great quest, reward yourself with some crunchy salad!",
        completed: false,
        startTime: "10:00", 
        endTime: "12:00",
        points: 10
    },
  });

  return (
    <AvatarContext.Provider
      value={{ avatar, setAvatar, points, setPoints, ownedCostumes, setOwnedCostumes, taskMap, setTaskMap}}
    >
      {children}
    </AvatarContext.Provider>
  );
}
