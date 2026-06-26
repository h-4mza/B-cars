import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  UseInterceptors, 
  UploadedFiles,
  Query
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.FLEET_MANAGER)
  @UseInterceptors(FilesInterceptor('images', 5))
  create(
    @Body() createVehicleDto: CreateVehicleDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.vehiclesService.create(createVehicleDto, files);
  }

  @Get('search')
  search(@Query() query: any) {
    return this.vehiclesService.search(query);
  }

  @Get()
  findAll(@Query() query: any) {
    // Basic filtering logic can be expanded
    const filters = {};
    if (query.brand) filters['brand'] = query.brand;
    if (query.status) filters['status'] = query.status;
    
    return this.vehiclesService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
