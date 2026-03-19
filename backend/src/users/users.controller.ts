import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/user.dto';
import { PhoneDto } from 'src/dto/phone.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/entities/user.entity';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    public getUsers(){
        return this.usersService.getAll();
    }

    @Get(':id')
    public getUser( @Param('id', ParseIntPipe) id: number){
        return this.usersService.getById(id);
    }

    @Post()
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    public addUser(@Body() dto: UserDto){
        return this.usersService.create(dto);
    }

    @Delete(":id")
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    public deleteUser(@Req() req: any, @Param("id", ParseIntPipe) id: number){
        const loggedUserId = Number(req.user?.id);
        if (loggedUserId === id) {
            throw new ForbiddenException("Admin cannot delete own account.");
        }
        return this.usersService.delete(id);
    }

    @Put(":userId/:addInfosId")
    public updateUser(
        @Req() req: any,
        @Param("userId", ParseIntPipe) userId: number,
        @Param("addInfosId", ParseIntPipe) addInfosId: number,
        @Body() dto: UserDto
    ){
        const loggedUserId = Number(req.user?.id);
        const role: UserRole | undefined = req.user?.role;
        if (role !== UserRole.ADMIN && loggedUserId !== userId) {
            throw new ForbiddenException("You can only update your own profile.");
        }
        return this.usersService.update(userId, addInfosId, dto);
    }

    @Post(':id')
    public addPhone(
        @Req() req: any,
        @Param('id', ParseIntPipe) userId: number,
        @Body() dto: PhoneDto
    ){
        const loggedUserId = Number(req.user?.id);
        const role: UserRole | undefined = req.user?.role;
        if (role !== UserRole.ADMIN && loggedUserId !== userId) {
            throw new ForbiddenException("You can only edit your own phone numbers.");
        }
        return this.usersService.addPhoneNumber(userId, dto);
    }

    @Delete("removePhone/:phoneId/:userId")
    public removePhone(
        @Req() req: any,
        @Param("phoneId", ParseIntPipe) phoneId: number,
        @Param("userId", ParseIntPipe) userId: number
    ){
        const loggedUserId = Number(req.user?.id);
        const role: UserRole | undefined = req.user?.role;
        if (role !== UserRole.ADMIN && loggedUserId !== userId) {
            throw new ForbiddenException("You can only edit your own phone numbers.");
        }
        return this.usersService.removePhoneNumber(phoneId, userId);
    }

    @Get('search/:string')
    public getUsersByName(@Param("string") string: string){
        return this.usersService.getUsersByName(string);
    }

    
}
