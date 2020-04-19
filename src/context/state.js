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
    profile: { name: "" },
  };
  // reducer
  let reducer = (state, action) => {
    switch (action.type) {
      case "changeLanguage":
        changePanelLanguage(action.newLanguage);
        return {
          ...state,
          selectedLanguage: action.newLanguage,
        };
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
      <IntlProvider
        locale={initialState.selectedLanguage.code}
        messages={messages[initialState.selectedLanguage.code]}
      >
        {children}
      </IntlProvider>
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);
