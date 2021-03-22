import React from 'react';
import BankInformation from './BankInformation';
import PriceMatrix from './PriceMatrix';

type AccountPanelProps = {}
export default function AccountPanel({ }: AccountPanelProps) {
    return (<div>
        <BankInformation />
        <PriceMatrix />
    </div>);
}