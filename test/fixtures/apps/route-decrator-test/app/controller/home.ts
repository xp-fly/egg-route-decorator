import {Controller} from 'egg';
import {HttpController, Get} from '../../../../../../lib/decorator';

@HttpController()
export default class HomeController extends Controller {
  @Get()
  async index() {
    return 'hi, ' + this.app.plugins.routeDecorator.name;
  }
}
