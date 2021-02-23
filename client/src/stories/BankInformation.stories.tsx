import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';
import {BankInformation} from '../components/admin/BankInformation';
import { BankInformationProps } from '../components/admin/BankInformation';

export default {
    title: 'Bankinformation',
    component: BankInformation
} as Meta;

const Template: Story<BankInformationProps> = (args) => <BankInformation {...args} />

export const Main = Template.bind({});
Main.args = {
    bankInformation: {
        accountNo: '1234567890',
        regNo: '1234',
        _id: 'randomid'
    },
    t: (key: string) => {
        console.log('key', key);
        return {
            "validation:required": ""
        }[key] || 'not set';
    }
}

export const Error = Template.bind({});
Error.args = {
    error: "failed with a very long error message that might span over multiple lines",
    bankInformation: {
        accountNo: '1234567890',
        regNo: '1234',
        _id: 'randomid'
    },
    t: (key: string) => {
        console.log('key', key);
        return {
            "validation:required": "This field is required",
            "validation:regNo": "Reg. No.",
            "validation:accountNo": "Account No.",
            "app:bankInformation.header": "BankInformation",
            "app:bankInformation.regNoLabel": "Reg. No.",
            "app:bankInformation.regNoPlaceholder": "Registration Number.",
            "app:bankInformation.accountNoLabel": "Account No.",
            "app:bankInformation.accountNoPlaceholder": "Account No.",
            "common:button.save": "Save"
        }[key] || 'not set';
    }
}

/**
 * key validation:regNo
BankInformation.stories.tsx:22 key validation:required
BankInformation.stories.tsx:22 key validation:accountNo
BankInformation.stories.tsx:22 key validation:required
BankInformation.stories.tsx:22 key app:bankInformation.header
BankInformation.stories.tsx:22 key app:bankInformation.regNoLabel
BankInformation.stories.tsx:22 key app:bankInformation.regNoPlaceholder
BankInformation.stories.tsx:22 key app:bankInformation.accountNoLabel
BankInformation.stories.tsx:22 key app:bankInformation.accountNoPlaceholder

 */