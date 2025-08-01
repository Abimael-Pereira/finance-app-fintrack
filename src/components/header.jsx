import { ChevronDownIcon, LogOutIcon } from 'lucide-react';

import logo from '@/assets/images/logo.svg';
import { useAuthContext } from '@/context/auth';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Header = () => {
  const { user, signOut } = useAuthContext();
  return (
    <Card>
      <CardContent className="px-8 py-4">
        <div className="flex items-center justify-between gap-12">
          <img src={logo} alt="Logo FinTrack" />
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" className="space-x-1">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p>
                    {user.firstName} {user.lastName}
                  </p>
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Meu perfil</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button
                    variant="ghost"
                    size="small"
                    className="w-full justify-start"
                    onClick={signOut}
                  >
                    <LogOutIcon />
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;
