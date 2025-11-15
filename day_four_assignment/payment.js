class PaymentProcessor {
  constructor(apiClient) {
    this.apiClient = apiClient;

    // Constants instead of magic numbers
    this.CURRENCY_CONVERSION_RATE = 1.2;
    this.DISCOUNTS = {
      SUMMER20: 0.2,   // 20% off
      WELCOME10: 10    // 10 currency units off
    };
    this.REFUND_FEE_PERCENTAGE = 0.05;
    this.FRAUD_THRESHOLDS = {
      LIGHT: 100,
      HEAVY: 1000
    };
  }

  // main method and public
  processPayment(amount, currency, userId, paymentMethod, metadata, discountCode, fraudCheckLevel) {
    this.validatePaymentMethod(paymentMethod, metadata);

    if (fraudCheckLevel > 0) {
      this.runFraudCheck(userId, amount);
    }

    let finalAmount = this.applyDiscount(amount, discountCode);
    finalAmount = this.convertCurrency(finalAmount, currency);

    const transaction = this.buildTransaction(
      amount, finalAmount, currency, userId, paymentMethod, metadata, discountCode, fraudCheckLevel
    );

    this.sendToAPI(paymentMethod, transaction);

    this._sendConfirmationEmail(userId, finalAmount, currency);
    this._logAnalytics({ userId, amount: finalAmount, currency, method: paymentMethod });

    return transaction;
  }


  validatePaymentMethod(paymentMethod, metadata) {
    if (paymentMethod === "credit_card") {
      if (!metadata.cardNumber || !metadata.expiry) throw new Error("Invalid card metadata");
    } else if (paymentMethod === "paypal") {
      if (!metadata.paypalAccount) throw new Error("Invalid PayPal metadata");
    } else {
      throw new Error("Unsupported payment method");
    }
  }

  runFraudCheck(userId, amount) {
    if (amount < this.FRAUD_THRESHOLDS.LIGHT) {
      this._lightFraudCheck(userId, amount);
    } else {
      this._heavyFraudCheck(userId, amount);
    }
  }

  applyDiscount(amount, discountCode) {
    if (!discountCode) return amount;

    if (discountCode === "SUMMER20") return amount * (1 - this.DISCOUNTS.SUMMER20);
    if (discountCode === "WELCOME10") return amount - this.DISCOUNTS.WELCOME10;

    console.log("Unknown discount code");
    return amount;
  }

  convertCurrency(amount, currency) {
    if (currency !== "USD") return amount * this.CURRENCY_CONVERSION_RATE;
    return amount;
  }

  buildTransaction(amount, finalAmount, currency, userId, paymentMethod, metadata, discountCode, fraudCheckLevel) {
    return {
      userId,
      originalAmount: amount,
      finalAmount,
      currency,
      paymentMethod,
      metadata,
      discountCode,
      fraudChecked: fraudCheckLevel,
      timestamp: new Date().toISOString(),
    };
  }

  sendToAPI(paymentMethod, transaction) {
    const endpoints = {
      credit_card: "/payments/credit",
      paypal: "/payments/paypal"
    };

    const url = endpoints[paymentMethod] || "/payments/refund"; // default for refunds

    try {
      this.apiClient.post(url, transaction);
      console.log("Payment sent to API:", transaction);
    } catch (err) {
      console.error("Failed to send payment:", err);
      throw err;
    }
  }


// private method
  _lightFraudCheck(userId, amount) {
    console.log(`Light fraud check for user ${userId} on amount ${amount}`);
    console.log(amount < 10 ? "Very low risk" : "Low risk");
  }

  _heavyFraudCheck(userId, amount) {
    console.log(`Heavy fraud check for user ${userId} on amount ${amount}`);
    console.log(amount < this.FRAUD_THRESHOLDS.HEAVY ? "Medium risk" : "High risk");
  }

  _sendConfirmationEmail(userId, amount, currency) {
    console.log(`Sending email to user ${userId}: Your payment of ${amount} ${currency} was successful.`);
  }

  _logAnalytics(data) {
    console.log("Analytics event:", data);
  }

  //refund

  refundPayment(transactionId, userId, reason, amount, currency, metadata) {
    const refundFee = amount * this.REFUND_FEE_PERCENTAGE;

    const refund = {
      transactionId,
      userId,
      reason,
      amount,
      currency,
      metadata,
      netAmount: amount - refundFee,
      date: new Date()
    };

    this.apiClient.post("/payments/refund", refund);
    console.log("Refund processed:", refund);

    return refund;
  }
}

module.exports = PaymentProcessor;
