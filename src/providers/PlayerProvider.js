import React, { useReducer, createContext } from "react";

const uuid = () => {
  return 'xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const DATA = [
  {
    id: 1,
    name: "Joe",
    scores: [50, 150, 250, 450]
  },
  {
    id: 2,
    name: "Fred",
    scores: [100, 250, 250, 450]
  },
  {
    id: 3,
    name: "Jim",
    scores: [350, 250, 250, 450]
  },
  {
    id: 4,
    name: "Dan",
    scores: [350, 250, 250, 450]
  }
];

function reducer(state, action) {
  switch (action.type) {
    case 'add.player': {
      const id = uuid();
      return [
        ...state,
        {
          id: id,
          name: action.name,
          scores: []
        }
      ]
    }

    case 'remove.player': {
      return state.filter(item => item.id !== action.id);
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export const PlayerStateContext = createContext();
export const PlayerDispatchContext = createContext();

export function PlayerProvider({children}) {
  const [state, dispatch] = useReducer(reducer, DATA);

  return (
    <PlayerStateContext.Provider value={state}>
      <PlayerDispatchContext.Provider value={dispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerStateContext.Provider>
  )
}

export function usePlayerState() {
  const context = React.useContext(PlayerStateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider')
  }
  return context
}

export function usePlayerDispatch() {
  const context = React.useContext(PlayerDispatchContext);
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider')
  }
  return context
}