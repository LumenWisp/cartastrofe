import Aura from '@primeng/themes/aura';
import { definePreset } from '@primeng/themes';

export const themePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{orange.50}',
      100: '{orange.100}',
      200: '{orange.200}',
      300: '{orange.300}',
      400: '{orange.400}',
      500: '{orange.500}',
      600: '{orange.600}',
      700: '{orange.700}',
      800: '{orange.800}',
      900: '{orange.900}',
      950: '{orange.950}',
    },
    secondary: {
      50: '{red.50}',
      100: '{red.100}',
      200: '{red.200}',
      300: '{red.300}',
      400: '{red.400}',
      500: '{red.500}',
      600: '{red.600}',
      700: '{red.700}',
      800: '{red.800}',
      900: '{red.900}',
      950: '{red.950}',
    },
    app: {
      body: 'white',
    },
  },
  components: {
    menubar: {
      root: {
        borderRadius: '0',
        background: 'white',
        borderColor: 'white',
      },
      submenu: {
        background: 'white',
        borderColor: 'transparent',
      },
      item: {
        color: 'black',
        focusColor: '{primary-700}',
        focusBackground: 'transparent',
        iconColor: 'black',
        iconFocusColor: '{primary-700}',
      },
      mobileButton: {
        color: 'black',
        hoverColor: '{primary-700}',
        hoverBackground: 'transparent',
      }
    },
    panel: {
      root: {
        background: 'white',
        borderColor: '{primary-400}',
        color: 'black',
      },
      header: {
        color: 'black',
      },
    },
  },
});
