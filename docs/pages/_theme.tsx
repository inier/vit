import React from 'react';
import { Link } from 'react-router-dom';
import { createTheme } from 'vite-pages-theme-basic';

export default createTheme({
  topNavs: [
    {
      text: 'GitHub',
      href: 'https://github.com/vitjs/vit',
    },
  ],
  logo: (
    <Link
      to='/'
      style={{
        color: 'black',
        textDecoration: 'unset'
      }}
    >
      ViteJS
    </Link>
  ),
});
