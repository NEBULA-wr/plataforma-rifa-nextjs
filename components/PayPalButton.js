import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';

const PayPalButton = ({ onSuccess }) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '85.00', // El precio en USD
          currency_code: 'USD'
        }
      }]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(details => {
      // El pago fue exitoso
      onSuccess();
    }).catch(err => {
      toast.error('Ocurrió un error con el pago.');
    });
  };
  
  const onError = (err) => {
      toast.error('PayPal encontró un error. Intenta de nuevo.');
  }

  return (
    <>
      {isPending && <div className="spinner" />}
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        disabled={false}
      />
    </>
  );
};

export default PayPalButton;