import React from 'react';

const Button = ({ children, variant }) => {
  const baseClasses = "gap-2.5 self-stretch p-5 rounded-xl border border-solid";
  const variantClasses = variant === 'primary' 
    ? "bg-green-700 border-white" 
    : "border-green-700";

  return (
    <button className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  );
};

const AuthButtons = () => {
  return (
    <nav className="flex gap-9 self-stretch my-auto text-xl font-medium text-white rounded-none w-[234px]">
      <Button variant="secondary">Sign In</Button>
      <Button variant="primary">Login</Button>
    </nav>
  );
};

export default AuthButtons;