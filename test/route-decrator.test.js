'use strict';

const mock = require('egg-mock');

describe('test/route-decrator.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/route-decrator-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, routeDecorator')
      .expect(200);
  });
});
