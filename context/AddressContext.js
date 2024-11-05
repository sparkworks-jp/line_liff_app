import React, { createContext, useContext, useState } from 'react';

const AddressContext = createContext();

export const useAddress = () => {
  return useContext(AddressContext);
};

export const AddressProvider = ({ children }) => {
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  return (
    <AddressContext.Provider value={{ addressList, setAddressList, selectedAddressId, setSelectedAddressId }}>
      {children}
    </AddressContext.Provider>
  );
};
