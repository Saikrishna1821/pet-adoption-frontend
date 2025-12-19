import React, { useState } from "react";


const SearchBar = (props) => {
     const { placeholder, value, onChange, type = "text" } = props;
  return (
    <div className="search-wrapper">
    
       <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
    
  );
};

export default SearchBar;


