import React, { createContext, useContext, useReducer } from "react";

// Set language attributes when change language
const changePanelLanguage = (selected) => {
  document.documentElement.setAttribute("lang", selected.name);
  document.dir = selected.direction;
  localStorage.setItem("@defaultLanguage", selected.code);
};

export const StateContext = createContext({});

export const StateProvider = ({ children }) => {
  // intial state
  let initialState = {
    profile: null,
  };
  // reducer
  let reducer = (state, action) => {
    switch (action.type) {
      case "updateProfile":
        return {
          ...state,
          profile: action.profile,
        };
      default:
        return { ...initialState };
    }
  };

  return (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
