import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service';
import { EncryptionService } from '../common/utils/encryption.service';
import { DocumentType } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
    private encryptionService: EncryptionService,
  ) {}

  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    type: DocumentType,
  ) {
    // 1. Encrypt the file
    const { encryptedBuffer, encryptedKeyBundle } = await this.encryptionService.encrypt(file.buffer);

    // 2. Upload to S3
    const s3Key = await this.filesService.uploadBuffer(
      encryptedBuffer,
      file.originalname,
      file.mimetype,
      `documents/${userId}`,
    );

    // 3. Save to DB
    return this.prisma.document.create({
      data: {
        userId,
        type,
        s3Key,
        encryptedKey: encryptedKeyBundle,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDecryptedDocument(userId: string, documentId: string, userRole: string) {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new NotFoundException('Document not found');

    // Access control: only owner or admin can see the document
    if (document.userId !== userId && userRole !== 'ADMIN' && userRole !== 'AGENT') {
      throw new UnauthorizedException('Access denied');
    }

    // 1. Get raw encrypted data from S3
    const encryptedData = await this.filesService.getObject(document.s3Key);

    // 2. Decrypt it
    return this.encryptionService.decrypt(encryptedData, document.encryptedKey);
  }

  async verifyDocument(documentId: string, isVerified: boolean) {
    return this.prisma.document.update({
      where: { id: documentId },
      data: { isVerified },
    });
  }
}
