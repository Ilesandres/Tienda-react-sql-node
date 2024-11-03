import { createContext, useReducer } from "react";
import storeReducer, { initialStore } from "./userReducer";

const Storecontext=createContext();

const StoreProvider=({children})=>{
    const  [store, dispatch]=useReducer(storeReducer, initialStore);

    return(
        <Storecontext.Provider value={[store, dispatch]}>
            {children}
        </Storecontext.Provider>
    )

}

export {Storecontext};

export default StoreProvider;