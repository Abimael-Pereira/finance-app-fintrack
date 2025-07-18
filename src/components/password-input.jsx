import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';

const PasswordInput = ({ placeholder = 'Digite sua senha' }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={passwordVisible ? 'text' : 'password'}
        placeholder={placeholder}
      />
      <Button
        variant="ghost"
        onClick={() => setPasswordVisible((prev) => !prev)}
        className="absolute bottom-0 right-0 top-0 my-auto mr-1 h-8 w-8 text-muted-foreground"
      >
        {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
    </div>
  );
};

export default PasswordInput;
