import { ApiQueryParams } from '@decorator/api-query-params.decorator';
import { GetCurrentUserId } from '@decorator/get-current-user-id.decorator';
import AqpDto from '@interceptor/aqp/aqp.dto';
import { UserFcmMessageInterface } from '@lazy-module/fcm/interfaces/user-fcm-message.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ParseObjectIdPipe from '@pipe/parse-object-id.pipe';
import { Request as ExpressRequest, Router } from 'express';
import { Types } from 'mongoose';
import CheckEmailExistDto from './dto/check-email-exist';
import CreateUserDto from './dto/create-user.dto';
import { UpdatePasswordByEmailDto } from './dto/update-password-by-email.dto';
import { UpdatePassword } from './dto/update-password.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import UpdateUserDto from './dto/update-user.dto';
import { ExerciseLeverEnum } from './enums/exercise-level.enum';
import { Gender } from './enums/gender.enum';
import FcmUserService from './fcm/fcm-user.service';
import UserRepository from './user.repository';
import UserService from './user.service';

@ApiTags('User')
@Controller()
export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fcmUserService: FcmUserService,
    private userRepository: UserRepository,
  ) {}

  /**
   * findAll
   * @param query
   * @returns
   */
  @Get('')
  @HttpCode(200)
  async findAll(@ApiQueryParams() query: any): Promise<any> {
    const { filter, population, projection } = query;

    const result = await this.userService.findManyBy(filter, {
      populate: population,
      projection,
    });

    return result;
  }

  /**
   * create
   * @param body
   * @returns
   */
  @Post('')
  @HttpCode(201)
  async create(@Body() body: CreateUserDto): Promise<any> {
    return this.userService.create(body);
  }

  /**
   * Update user by deviceID
   * @param deviceID
   * @param body
   * @returns
   */
  @Put('deviceID/:deviceID')
  @HttpCode(200)
  async updateByDeviceID(
    @Param('deviceID') deviceID: string,
    @Body() body: UpdateUserDto,
  ) {
    const user = await this.userService.findOneBy({ deviceID });

    if (!user) {
      return await this.userRepository.create({
        deviceID,
        password: deviceID,
        fullName: deviceID,
      });
    }

    return this.userService.updateOneBy({ deviceID }, body);
  }

  /**
   * Update roles of user by id
   * @param id
   * @param body
   * @returns
   */
  @Put(':id/roles')
  @HttpCode(200)
  async updateRoles(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateRolesDto,
  ) {
    return this.userService.updateRolesById(id, body);
  }

  /**
   * Fcm push
   * @param userId
   * @param message
   * @returns
   */
  @Put(':id/fcm-push')
  @HttpCode(200)
  async push(
    // @Request() req: ExpressRequest,
    @Param('id') userId: Types.ObjectId,
    @Body() message: UserFcmMessageInterface,
  ): Promise<any> {
    await this.fcmUserService.pushFCMToUsers([userId], message);
    // await this.userService.pushFCMToTopic('topics/demo', message);
    return {};
  }

  /**
   * Add deviceId
   * @param userId
   * @param deviceID
   * @returns
   */
  @Put(':id/add-deviceID')
  @HttpCode(200)
  async addDeviceID(
    @GetCurrentUserId() userId: Types.ObjectId,
    @Body('deviceID') deviceID: string,
  ): Promise<any> {
    const result = await this.userService.addDeviceID(userId, deviceID);

    return result;
  }

  /**
   * enable FCM
   */
  @Put(':id/enable-fcm')
  @HttpCode(200)
  async enableFCM(
    @Param('id') id: Types.ObjectId,
    @Body('isEnableFCM') isEnableFCM: boolean = true,
  ) {
    return this.userService.updateOneById(id, { isEnableFCM });
  }

  /**
   * update
   * @param id
   * @param body
   * @returns
   */
  @Put('/update-me')
  @HttpCode(200)
  async update(
    @GetCurrentUserId() id: Types.ObjectId,
    @Body() body: UpdateUserDto,
  ): Promise<any> {
    const user = await this.userService.updateOneById(id, body);
    return user;
  }

  @Put(':id/update-password')
  async updatePassword(
    @Param('id') userId: Types.ObjectId,
    @Body() data: UpdatePassword,
  ) {
    return this.userService.updatePasswordById(userId, data);
  }

  @Put('update-password/email')
  async updatePasswordByEmail(@Body() body: UpdatePasswordByEmailDto) {
    return this.userService.updatePasswordByEmail(body);
  }

  @Put(':id/reset')
  async resetData(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body('isRemoveAll', ParseBoolPipe) isRemoveAll: boolean,
  ) {
    const deletedUser = await this.userService.updateOneById(
      id,
      {
        deviceID: '',
        fcmTokens: [],
        fullName: 'ACCOUNT DELETED',
        isDeleted: true,
      },
      { new: false },
    );

    const { _id, ...newItem } = deletedUser.toJSON();

    if (isRemoveAll) {
      Object.assign(newItem, {
        app5Rating: 0,
        targetWeight: 0,
        weight: 0,
        height: 0,
        exerciseLevel: ExerciseLeverEnum.beginner,
        bodyPart: [],
        exerciseDays: [],
        fullName: '',
        avatar: '',
        dateOfBirth: 0,
        gender: Gender.other,
      });
    }

    return this.userService.create(newItem as any);
  }

  /**
   * update
   * @param id
   * @param body
   * @returns
   */
  @Put(':id/premium')
  @HttpCode(200)
  async updatePremium(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body('premiumStartDate') premiumStartDate: number,
    @Body('premiumEndDate') premiumEndDate: number,
  ) {
    const result = await this.userService.updateOneById(id, {
      premiumStartDate,
      premiumEndDate,
      isPremium: true,
    });

    return result;
  }

  /**
   * update
   * @param id
   * @param body
   * @returns
   */
  @Put(':id')
  @HttpCode(200)
  async updateById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateUserDto,
  ) {
    const result = await this.userService.updateOneById(id, body);

    return result;
  }

  /**
   * Delete
   * @param id
   * @returns
   */
  @Delete(':id/hard')
  // @HttpCode(204)
  async deleteHard(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    return this.userService.deleteOneHardById(id);
  }

  /**
   * Delete hard many by ids
   * @param ids
   * @returns
   */
  @Delete(':ids/ids')
  // @HttpCode(204)
  async deleteManyByIds(@Param('ids') ids: string): Promise<any> {
    const result = await this.userService.deleteManyByIds(
      ids.split(',').map((item: any) => new Types.ObjectId(item)),
    );
    return result;
  }

  /**
   * Delete hard many by ids
   * @param ids
   * @returns
   */
  @Delete(':ids/hard-ids')
  // @HttpCode(204)
  async deleteManyHardByIds(@Param('ids') ids: string): Promise<any> {
    const result = await this.userService.deleteManyHardByIds(
      ids.split(',').map((item: any) => new Types.ObjectId(item)),
    );
    return result;
  }

  /**
   * Delete
   * @param id
   * @returns
   */
  @Delete(':id')
  @HttpCode(200)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    return this.userService.deleteOneById(id);
  }

  /**
   * paginate
   * @param query
   * @returns
   */
  @Get('paginate')
  @HttpCode(200)
  async paginate(@ApiQueryParams() query: AqpDto): Promise<any> {
    return this.userService.paginate(query);
  }

  /**
   * Get current userlogged in
   * @param id
   * @returns
   */
  @Get('me')
  @HttpCode(200)
  async me(
    @GetCurrentUserId() id: Types.ObjectId,
    @ApiQueryParams() { population, projection, filter }: AqpDto,
  ): Promise<any> {
    const result = await this.userService.findOneById(id, {
      populate: population,
      projection,
    });

    if (!result) throw new NotFoundException('User not found.');

    return result;
  }

  @Get('check-email-exist')
  async checkEmailExist(@Query() query: CheckEmailExistDto) {
    const userExist = await this.userService.paginate({
      filter: {
        email: query.email,
      },
    });

    if (userExist.results.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Reset authorization
   *
   * @returns
   */
  @HttpCode(200)
  @Get('reset-authorization')
  resetAuthorization(@Request() req: ExpressRequest) {
    const router = req.app._router as Router;
    return this.userService.resetAuthorization(router);
  }

  /**
   * findOneById
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(200)
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @ApiQueryParams() { population, projection }: AqpDto,
  ) {
    return this.userService.findOneById(id, {
      populate: population,
      projection,
    });
  }
}
