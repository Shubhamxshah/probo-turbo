import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '60s', // adjust based on how long you want it to run
};

export default function () {
  const baseUrl = 'https://fcfe-2409-40c1-415f-c559-7f99-a0d3-f54-4318.ngrok-free.app/api/v1';

  const mintPayload = JSON.stringify({
    userId: 'LDzVTLGAX2Who2OJhUsV36G7XLnnnzU9',
    event: 'ethusd100',
    noOfTokens: 10,
  });

  const sellPayload = JSON.stringify({
    userId: 'LDzVTLGAX2Who2OJhUsV36G7XLnnnzU9',
    noOfTokens: 2,
    event: 'ethusd100',
    type: 'YES',
    price: '550',
  });

  const buyPayload = JSON.stringify({
    userId: 'mLjNq8O0c0YFhjJ1HQ9960PusfiCxFai',
    noOfTokens: 2,
    event: 'ethusd100',
    type: 'YES',
    price: '550',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Mint once per VU
  http.post(`${baseUrl}/balance/mint`, mintPayload, params);
  sleep(0.5);

  // Sell 5 times
  for (let i = 0; i < 5; i++) {
    http.post(`${baseUrl}/trade/sell`, sellPayload, params);
    sleep(0.2);
  }

  // Buy 5 times
  for (let i = 0; i < 5; i++) {
    http.post(`${baseUrl}/trade/buy`, buyPayload, params);
    sleep(0.2);
  }
}

