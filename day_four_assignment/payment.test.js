const PaymentProcessor = require('./payment');

describe('PaymentProcessor (smelly version)', () => {
  let apiClient;
  let processor;

  beforeEach(() => {
    apiClient = {
      post: jest.fn(),
    };

    processor = new PaymentProcessor(apiClient);

    // Spy on private methods
    jest.spyOn(processor, '_sendConfirmationEmail');
    jest.spyOn(processor, '_logAnalytics');
    jest.spyOn(processor, '_lightFraudCheck');
    jest.spyOn(processor, '_heavyFraudCheck');
  });
-
  test('processes a valid credit card payment', () => {
    const metadata = { cardNumber: '123', expiry: '12/25' };

    const result = processor.processPayment(
      100,
      "USD",
      "user1",
      "credit_card",
      metadata,
      null,
      0
    );

    expect(apiClient.post).toHaveBeenCalledWith("/payments/credit", expect.any(Object));
    expect(result.finalAmount).toBe(100);
    expect(processor._sendConfirmationEmail).toHaveBeenCalled();
    expect(processor._logAnalytics).toHaveBeenCalled();
  });

 
  test('processes a valid PayPal payment', () => {
    const metadata = { paypalAccount: 'user@paypal.com' };

    const result = processor.processPayment(
      50,
      "USD",
      "user2",
      "paypal",
      metadata,
      null,
      0
    );

    expect(apiClient.post).toHaveBeenCalledWith("/payments/paypal", expect.any(Object));
    expect(result.finalAmount).toBe(50);
  });

  test('throws error for invalid credit card metadata', () => {
    expect(() => {
      processor.processPayment(
        100,
        "USD",
        "u1",
        "credit_card",
        { cardNumber: null },
        null,
        0
      );
    }).toThrow("Invalid card metadata");
  });

// discount
  test('applies SUMMER20 discount', () => {
    const metadata = { cardNumber: '123', expiry: '12/25' };

    const result = processor.processPayment(
      100,
      "USD",
      "u1",
      "credit_card",
      metadata,
      "SUMMER20",
      0
    );

    expect(result.finalAmount).toBe(80);
  });

  test('applies WELCOME10 discount', () => {
    const metadata = { cardNumber: '123', expiry: '12/25' };

    const result = processor.processPayment(
      100,
      "USD",
      "u1",
      "credit_card",
      metadata,
      "WELCOME10",
      0
    );

    expect(result.finalAmount).toBe(90);
  });

// currency
  test('converts non-USD currency', () => {
    const metadata = { cardNumber: '123', expiry: '12/25' };

    const result = processor.processPayment(
      100,
      "EUR",
      "u1",
      "credit_card",
      metadata,
      null,
      0
    );

    // 100 * 1.2 = 120
    expect(result.finalAmount).toBe(120);
  });

  // fraud check
  test('performs light fraud check for small amounts', () => {
    const metadata = { cardNumber: '123', expiry: '12/25' };

    processor.processPayment(
      50,
      "USD",
      "u1",
      "credit_card",
      metadata,
      null,
      1
    );

    expect(processor._lightFraudCheck).toHaveBeenCalled();
  });

  test('performs heavy fraud check for large amounts', () => {
    const metadata = { cardNumber: '123', expiry: '12/25' };

    processor.processPayment(
      200,
      "USD",
      "u1",
      "credit_card",
      metadata,
      null,
      1
    );

    expect(processor._heavyFraudCheck).toHaveBeenCalled();
  });

//   Refund payment
  test('processes refund and applies refund fee', () => {
    const refund = processor.refundPayment(
      "tx1",
      "user1",
      "reason",
      100,
      "USD",
      {}
    );

    // fee = 5% of 100 = 5
    expect(refund.netAmount).toBe(95);
    expect(apiClient.post).toHaveBeenCalledWith(
      "/payments/refund",
      expect.any(Object)
    );
  });
});
