import {createContext, useContext, useEffect, useState} from "react";

const BasketContext = createContext();

export function BasketProvider({ children }) {
    const [basket, setBasket] = useState(()=>{
        const saved = localStorage.getItem("basket");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("basket", JSON.stringify(basket));
    }, [basket]);

    const addToBasket = (itemId) => {
        if(basket.includes(itemId))
            return ;
        setBasket([...basket, itemId]);
    };

    const removeFromBasket = (itemId) => {
        setBasket(basket.filter(id => id !== itemId));
    };

    const clearBasket = () => {
      setBasket([]);
    };

    return (
      <BasketContext.Provider value={{basket, addToBasket, removeFromBasket, clearBasket}}>
          {children}
      </BasketContext.Provider>
    );
}

export const useBasket = () => useContext(BasketContext);
