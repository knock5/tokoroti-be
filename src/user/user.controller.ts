import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import * as CreateUserDtoModule from './dto/create-user.dto';
import * as UpdateUserDtoModule from './dto/update-user.dto';
import { ZodValidationPipe } from 'nestjs-zod';
import { User } from '../generated/prisma/client';

type CreateUserDto = CreateUserDtoModule.CreateUserDto;
type UpdateUserDto = UpdateUserDtoModule.UpdateUserDto;

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private toUserResponse(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      Role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private toUserResponses(users: User[]) {
    return users.map((user) => this.toUserResponse(user));
  }

  @Get()
  async findAll() {
    const res = await this.userService.findAll();

    return {
      message: 'Berhasil mengambil semua user',
      data: this.toUserResponses(res),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const res = await this.userService.findOne(Number(id));

    return {
      message: 'Berhasil mengambil user',
      data: this.toUserResponse(res),
    };
  }

  @Post()
  @UsePipes(ZodValidationPipe)
  async create(@Body() dto: CreateUserDto) {
    const res = await this.userService.create(dto);

    return {
      message: 'Berhasil membuat user',
      data: this.toUserResponse(res),
    };
  }

  @Patch(':id')
  @UsePipes(ZodValidationPipe)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const res = await this.userService.update(Number(id), dto);

    return {
      message: 'Berhasil memperbarui user',
      data: this.toUserResponse(res),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const res = await this.userService.delete(Number(id));

    return {
      message: 'Berhasil menghapus user',
      data: this.toUserResponse(res),
    };
  }
}
