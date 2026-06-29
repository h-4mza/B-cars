import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class VehiclesService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async create(dto: CreateVehicleDto, files: Express.Multer.File[]) {
    const validFiles = files || [];
    const imageUrls = await Promise.all(
      validFiles.map((file) => this.filesService.uploadFile(file, 'vehicles')),
    );

    const { deposit, ...restDto } = dto;

    return this.prisma.vehicle.create({
      data: {
        ...restDto,
        depositAmount: deposit || 0,
        images: JSON.stringify(imageUrls),
        includedFeatures: '[]'
      },
    });
  }

  async search(query: any) {
    const { pickupLocationId, returnLocationId, pickupDate, pickupTime, returnDate, returnTime, category, maxPrice, sortBy } = query;
    const pickupLoc = pickupLocationId ? await this.prisma.location.findUnique({ where: { id: pickupLocationId } }) : null;
    const returnLoc = returnLocationId ? await this.prisma.location.findUnique({ where: { id: returnLocationId } }) : pickupLoc;
    
    let totalDays = 1;
    if (pickupDate && returnDate) {
      const start = new Date(`${pickupDate}T${pickupTime || '10:00'}:00`);
      const end = new Date(`${returnDate}T${returnTime || '10:00'}:00`);
      const msDiff = end.getTime() - start.getTime();
      totalDays = Math.ceil(msDiff / (1000 * 3600 * 24));
      if (totalDays <= 0 || isNaN(totalDays)) totalDays = 1;
    }

    const where: any = {
      deletedAt: null,
      status: 'AVAILABLE'
    };
    if (category) where.category = category;
    if (query.transmission) where.transmission = query.transmission;
    if (pickupLoc) where.locationId = pickupLoc.id;

    const allResults = await this.prisma.vehicle.findMany({ where });
    let results = allResults;

    if (maxPrice) results = results.filter(v => Number(v.pricePerDay) <= Number(maxPrice));

    if (sortBy === 'price_asc') {
      results.sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay));
    } else if (sortBy === 'price_desc') {
      results.sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay));
    } else if (sortBy === 'rating') {
      results.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    const formattedResults = await Promise.all(results.map(async (v) => {
      const pricePerDay = Number(v.pricePerDay);
      let parsedImages = [];
      try { parsedImages = typeof v.images === 'string' ? JSON.parse(v.images) : v.images; } catch(e) {}
      const images = parsedImages && parsedImages.length > 0 
        ? await Promise.all(parsedImages.map((key: string) => this.filesService.getPresignedUrl(key))) 
        : [];

      const badges: any[] = [];
      const sameCategory = allResults.filter(r => r.category === v.category);
      const isLowestPrice = sameCategory.length > 0 && pricePerDay === Math.min(...sameCategory.map(r => Number(r.pricePerDay)));
      if (isLowestPrice) badges.push({ type: 'BEST_PRICE', label: 'Le plus bas prix' });
      
      const avgPrice = sameCategory.reduce((sum, r) => sum + Number(r.pricePerDay), 0) / (sameCategory.length || 1);
      if (v.rating && v.rating >= 8.5 && pricePerDay <= avgPrice) {
        badges.push({ type: 'EXCELLENT', label: 'Excellente offre' });
      }

      return {
        ...v,
        images,
        totalPrice: pricePerDay * totalDays,
        numberOfDays: totalDays,
        currency: 'MAD',
        badges
      };
    }));

    const prices = formattedResults.map(v => Number(v.pricePerDay));
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxP = prices.length ? Math.max(...prices) : 0;

    return {
      results: formattedResults,
      meta: {
        totalDays,
        pickupLocation: pickupLoc,
        returnLocation: returnLoc,
        totalVehicles: formattedResults.length,
        availableVehicles: formattedResults.length
      },
      filters: {
        categories: [...new Set(formattedResults.map(v => v.category))],
        transmissions: [...new Set(formattedResults.map(v => v.transmission))],
        priceRange: { min: minPrice, max: maxP },
        features: ['airport_pickup', 'shuttle', 'unlimited_mileage']
      }
    };
  }

  async findAll(filters: any) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        deletedAt: null,
        ...filters,
      },
    });

    return Promise.all(
      vehicles.map(async (vehicle) => {
        let parsedImages = [];
        try { parsedImages = typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images; } catch(e) {}
        return {
          ...vehicle,
          images: parsedImages && parsedImages.length > 0 ? await Promise.all(
            parsedImages.map(async (key: string) => {
              if (key.startsWith('http')) return key;
              try {
                return await this.filesService.getPresignedUrl(key);
              } catch (e) {
                console.error('Failed to presign URL', e);
                return key; // Fallback to raw key if AWS is not configured
              }
            }),
          ) : [],
        };
      }),
    );
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle || vehicle.deletedAt) {
      throw new NotFoundException('Vehicle not found');
    }

    let parsedImages = [];
    try { parsedImages = typeof vehicle.images === 'string' ? JSON.parse(vehicle.images) : vehicle.images; } catch(e) {}

    return {
      ...vehicle,
      images: parsedImages && parsedImages.length > 0 ? await Promise.all(
        parsedImages.map(async (key: string) => {
          if (key.startsWith('http')) return key;
          try {
            return await this.filesService.getPresignedUrl(key);
          } catch (e) {
            console.error('Failed to presign URL', e);
            return key;
          }
        }),
      ) : [],
    };
  }

  async remove(id: string) {
    return this.prisma.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
