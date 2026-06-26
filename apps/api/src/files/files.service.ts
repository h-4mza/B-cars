import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'eu-west-3',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || 'mock_access_key',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || 'mock_secret_key',
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    return this.uploadBuffer(file.buffer, file.originalname, file.mimetype, folder);
  }

  async uploadBuffer(buffer: Buffer, originalName: string, mimetype: string, folder: string) {
    const key = `${folder}/${uuidv4()}-${originalName}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);
    return key;
  }

  async getObject(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const byteArray = await response.Body?.transformToByteArray();
    return Buffer.from(byteArray || []);
  }

  async getPresignedUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get<string>('AWS_BUCKET_NAME'),
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: 300 }); // 5 minutes max as per prompt
  }
}
