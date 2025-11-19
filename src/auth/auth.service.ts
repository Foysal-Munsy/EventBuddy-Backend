import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException(
        'User already exists, please log in or use new credentials.',
      );
    }
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new ConflictException('Please log in or use new credentials.');
    }
    if (!(await bcrypt.compare(loginUserDto.password, user.password))) {
      throw new ConflictException('Invalid credentials provided.');
    }
    // jwt
    return this.jwtService.signAsync({
      id: user.id,
    });
  }
}
