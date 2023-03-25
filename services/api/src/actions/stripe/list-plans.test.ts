import { setupServer } from '../../test-utils/setup-server';

describe('GET /stripe/plans', () => {
  const getRequest = setupServer();

  it('can fetch a list of plans', async () => {
    const response = await getRequest().get('/stripe/plans');

    expect(response.status).toBe(200);

    const { plans } = response.body;
    expect(plans.length).toBeGreaterThan(0);
  });
});
