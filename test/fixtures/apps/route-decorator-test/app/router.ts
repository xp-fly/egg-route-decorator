import {RouteDecorator} from '../../../../../lib';
import {resolve} from 'path';

export default (app) => {
  const route = new RouteDecorator();
  route.scanController(app, resolve(__dirname, 'controller'));
}
