import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  UploadedFile, 
  UseGuards, 
  UseInterceptors, 
  Body,
  Req,
  Res,
  StreamableFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DocumentType } from '@prisma/client';
import type { Response } from 'express';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('type') type: DocumentType
  ) {
    return this.documentsService.uploadDocument(req.user.userId, file, type);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.documentsService.findAllByUser(req.user.userId);
  }

  @Get(':id/download')
  async download(
    @Req() req: any,
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const buffer = await this.documentsService.getDecryptedDocument(
      req.user.userId, 
      id, 
      req.user.role
    );
    
    // Set basic headers for download (could be improved by storing original mimetype)
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="document-${id}"`,
    });

    return new StreamableFile(buffer);
  }
}
