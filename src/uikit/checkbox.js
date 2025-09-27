import IconCheckSimple from "./icons/check-simple";

const Checkbox = ({ checked = false }) => {
  return (
    <div className={`checkbox ${checked ? "selected" : ""}`}>
      {checked && <IconCheckSimple size={24} />}
    </div>
  );
};

export default Checkbox;
