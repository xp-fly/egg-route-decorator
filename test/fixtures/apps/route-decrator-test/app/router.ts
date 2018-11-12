import {RouteDecorator} from '../../../../../lib';

export default (app) => {
  const route = new RouteDecorator();
  route.scanController(app, '', '');
}
