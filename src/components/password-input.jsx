import { EyeIcon, EyeOffIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';

const PasswordInput = React.forwardRef(
  ({ placeholder = 'Digite sua senha', ...props }, ref) => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
      <div className="relative">
        <Input
          type={passwordVisible ? 'text' : 'password'}
          placeholder={placeholder}
          ref={ref}
          {...props}
        />
        <Button
          variant="ghost"
          type="button"
          onClick={() => setPasswordVisible((prev) => !prev)}
          className="absolute bottom-0 right-0 top-0 my-auto mr-1 h-8 w-8 text-muted-foreground"
        >
          {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
