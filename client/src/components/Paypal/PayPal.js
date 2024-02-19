import React, { useRef, useEffect } from "react";

function PayPal({ amount, currency, onSuccess, onError }) {
  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Course Enrollment Payment",
                amount: {
                  currency_code: currency,
                  value: amount,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          onSuccess(order);
        },
        onError: (err) => {
          onError(err);
        },
      })
      .render(paypal.current);
  }, [amount, currency, onError, onSuccess]);

  return <div ref={paypal}></div>;
}

export default PayPal;
