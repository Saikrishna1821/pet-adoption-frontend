import React from "react";

const Loader = (props) => {
  const { text = "Loading..." } = props;
  return (
    <div className="loader">
      <strong>{text}</strong>
    </div>
  );
};

export default Loader;
