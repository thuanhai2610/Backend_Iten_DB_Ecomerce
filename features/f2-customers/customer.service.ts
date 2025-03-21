// f2-customers/customer.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Customer } from './schemas/customer.schema';
import { LoginCustomerDto } from './dto/login-customer.dto';
import CreateCustomerDto from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private readonly jwtService: JwtService,
  ) {}
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const { email, password, name } = createCustomerDto;
    const existingCustomer = await this.customerModel.findOne({ email });
    if (existingCustomer) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = new this.customerModel({
      name,
      email,
      password: hashedPassword,
    });

    return customer.save();
  }

  async login(loginCustomerDto: LoginCustomerDto): Promise<{ accessToken: string }> {
    const { email, password } = loginCustomerDto;
    const customer = await this.customerModel.findOne({ email });
    if (!customer) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, customer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

 
    const payload = { sub: customer._id, email: customer.email };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
 
  async findManyBy(query: any): Promise<Customer[]> {
    return this.customerModel.find(query).exec();
  }

  async findOneById(id: string): Promise<Customer | null> {
    return this.customerModel.findById(id).exec();
  }
}