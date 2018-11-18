'use strict';

const mock = require('egg-mock');

describe('test/route-decrator.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/route-decorator-test',
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

  it('should POST /', () => {
    return app.httpRequest()
      .post('/')
      .expect('post method')
      .expect(200);
  });

  it('should PUT /', () => {
    return app.httpRequest()
      .put('/')
      .expect('put method')
      .expect(200);
  });

  it('should DELETE /', () => {
    return app.httpRequest()
      .delete('/')
      .expect('delete method')
      .expect(200);
  });

});
