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
        background: '{primary-800}',
        borderColor: '{primary-800}',
      },
      submenu: {
        background: '{primary-700}',
        borderColor: '{primary-700}',
      },
      item: {
        color: 'white',
        focusBackground: 'white',
        iconColor: 'white',
        iconFocusColor: 'black',
      },
      mobileButton: {
        color: 'white',
        hoverColor: 'black',
        hoverBackground: 'white',
      }
    },
  },
});
