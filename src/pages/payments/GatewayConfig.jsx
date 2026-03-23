import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PaymentConfig from '../../components/PaymentConfig';

const GatewayConfigPage = () => {
    const { token } = useAuth();

    return (
        <div className="animate-fade-in pb-8">
            <PaymentConfig token={token} />
        </div>
    );
};

export default GatewayConfigPage;
