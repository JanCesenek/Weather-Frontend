const Button = ({ classes, click, disabled, title }) => {
  return (
    <button
      className={`px-5 py-2 rounded-md bg-black shadow-md shadow-blue-800/50 text-[2rem] hover:shadow-black/50 hover:text-black hover:bg-blue-200 ${
        classes ? classes : undefined
      }`}
      onClick={click}
      disabled={disabled}>
      {title}
    </button>
  );
};

export default Button;
