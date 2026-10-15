import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up to 50 VUs
    { duration: '1m', target: 200 },  // Peak load: 200 VUs (simulating morning attendance rush)
    { duration: '30s', target: 0 },   // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200'], // 95% of requests must complete below 200ms
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000/api/v1';

export default function () {
  const resHealth = http.get(`${BASE_URL}/health/liveness`);
  check(resHealth, {
    'liveness status is 200': (r) => r.status === 200,
  });

  const resPublic = http.get(`${BASE_URL}/public/info?schoolId=sample-school-id`);
  check(resPublic, {
    'public info status is 200 or 400': (r) => r.status === 200 || r.status === 400,
  });

  sleep(1);
}
