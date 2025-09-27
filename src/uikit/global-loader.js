const GlobalLoader = ({ show = false }) => {
  return show ? (
    <div className="global-loader-container">
      {" "}
      <div className="global-loader" />
    </div>
  ) : null;
};

export default GlobalLoader;
