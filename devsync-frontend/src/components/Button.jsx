const Button = ({ children, type = "button", onClick, disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      // Tailwind classes: yellow bg, navy text, rounded corners, hover effect
      className="w-full bg-brand-yellow text-brand-navy font-bold py-2 px-4 rounded hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* 'children' is whatever text we put inside <Button>Text</Button> */}
      {children}
    </button>
  );
};

export default Button;
