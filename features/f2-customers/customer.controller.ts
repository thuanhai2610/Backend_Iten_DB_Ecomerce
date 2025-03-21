
import WrapResponseInterceptor from '@interceptor/wrap-response.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import CreateCustomerDto from './dto/create-customer.dto';
import { LoginCustomerDto } from './dto/login-customer.dto';
import { CustomerService } from './customer.service';

@ApiTags('Customers')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
@Injectable()
 export class CustomerController {
  constructor( private readonly customerService: CustomerService) {}
   @Get('')
   @HttpCode(200)
   async findAll(@Query() query: any): Promise <any> {
    const result = await this.customerService.findManyBy(query);
    return result;
   }

   @Post('')
   @HttpCode(201)
   async create(@Body() body: CreateCustomerDto): Promise<any> {
    const result = await this.customerService.create(body)
    return result;
   }

   @Post('login')
   @HttpCode(200)
   async login(@Body() body: LoginCustomerDto): Promise<any>{
    const result = await this.customerService.login(body)
    return result;
   }
   


   @Get(':id')
   @HttpCode(200)

   async findOneById(@Param('id') id: string): Promise<any>{
    const result = await this.customerService.findOneById(id);
    if(!result) throw new NotFoundException('Not found')
      return result;
   }

 }

  

