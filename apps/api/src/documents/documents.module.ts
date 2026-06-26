import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { EncryptionService } from '../common/utils/encryption.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, EncryptionService],
  exports: [DocumentsService]
})
export class DocumentsModule {}
