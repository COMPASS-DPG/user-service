import { Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { CreateMockUserDto } from "./dto/create-mock-user.dto";
import { UpdateMockUserDto } from "./dto/update-mock-user.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class MockUserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  public async create(createMockUserDto: CreateMockUserDto) {
    // Hashing the password
    const hashedPassword = await this.authService.hashPassword(
      createMockUserDto.password
    );
    return await this.prisma.user.create({
      data: {
        ...createMockUserDto,
        password: hashedPassword,
      },
      select: {
        ...this.userSelectObj,
      },
    });
  }

  public async findAll() {
    return await this.prisma.user.findMany({
      select: {
        ...this.userSelectObj,
      },
    });
  }

  public async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        ...this.userSelectObj,
      },
    });
    if (!user) throw new NotFoundException(`User with id #${id} not found`);
    return user;
  }

  public async update(id: string, updateMockUserDto: UpdateMockUserDto) {
    return await this.prisma.user.update({
      where: {
        id,
      },
      select: {
        ...this.userSelectObj,
      },
      data: updateMockUserDto,
    });
  }

  public async remove(id: string) {
    return await this.prisma.user.delete({
      where: {
        id,
      },
      select: {
        ...this.userSelectObj,
      },
    });
  }

  public async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  userSelectObj = {
    id: true,
    email: true,
    role: true,
    userName: true,
    profilePicture: true,
    designation: true,
    createdAt: true,
    updatedAt: true,
  };
}
