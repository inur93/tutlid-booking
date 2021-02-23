import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { addDecorator } from '@storybook/react';
import { withI18n } from 'storybook-addon-i18n';
import { muiTheme } from 'storybook-addon-material-ui';

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'da', right: 'dk', title: 'Dansk' }
      ],
    },
  }
}

export const decorators = [
  muiTheme()
]
addDecorator(withInfo)
addDecorator(withKnobs)
addDecorator(withI18n)
