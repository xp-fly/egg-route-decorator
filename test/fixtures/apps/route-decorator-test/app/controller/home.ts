import {Controller} from 'egg';
import {HttpController, Get, Post, Put, Delete} from '../../../../../../lib/decorator';

@HttpController('')
export default class HomeController extends Controller {
  @Get()
  async get() {
    return 'hi, ' + this.app.plugins.routeDecorator.name;
  }

  @Post()
  async post() {
    return 'post method';
  }

  @Put()
  async put() {
    return 'put method';
  }

  @Delete()
  async delete() {
    return 'delete method';
  }
}
