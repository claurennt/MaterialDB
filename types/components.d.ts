import 'react';

export type NewLinkModalType = 'topic' | 'link';

export type Credentials = {
  email?: string;
  password: string;
  username: string;
};

declare module 'react' {
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    commandfor?: string;
    command?: 'show-modal' | 'close' | 'toggle-popper' | string;
  }
}
