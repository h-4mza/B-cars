import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly masterKey: Buffer;
  private readonly algorithm = 'aes-256-gcm';

  constructor(private configService: ConfigService) {
    const hexKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!hexKey || hexKey.length !== 64) {
      throw new Error('ENCRYPTION_KEY must be a 32-byte hex string (64 characters)');
    }
    this.masterKey = Buffer.from(hexKey, 'hex');
  }

  // Envelope Encryption: Encrypt file with a random key, then encrypt that key with master key
  async encrypt(data: Buffer) {
    // 1. Generate a unique key for this document
    const documentKey = crypto.randomBytes(32);
    
    // 2. Encrypt the data with the document key
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, documentKey, iv);
    const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // 3. Encrypt the document key with the master key
    const masterIv = crypto.randomBytes(12);
    const masterCipher = crypto.createCipheriv(this.algorithm, this.masterKey, masterIv);
    const encryptedKey = Buffer.concat([masterCipher.update(documentKey), masterCipher.final()]);
    const masterAuthTag = masterCipher.getAuthTag();

    return {
      encryptedBuffer: Buffer.concat([iv, authTag, encryptedData]),
      // Store the encrypted key bundle as a hex string for DB
      encryptedKeyBundle: Buffer.concat([masterIv, masterAuthTag, encryptedKey]).toString('hex'),
    };
  }

  async decrypt(encryptedBuffer: Buffer, encryptedKeyBundleHex: string) {
    const masterBundle = Buffer.from(encryptedKeyBundleHex, 'hex');
    
    // 1. Decrypt the document key using master key
    const masterIv = masterBundle.subarray(0, 12);
    const masterAuthTag = masterBundle.subarray(12, 28);
    const encryptedKey = masterBundle.subarray(28);

    const masterDecipher = crypto.createDecipheriv(this.algorithm, this.masterKey, masterIv);
    masterDecipher.setAuthTag(masterAuthTag);
    const documentKey = Buffer.concat([masterDecipher.update(encryptedKey), masterDecipher.final()]);

    // 2. Decrypt the data using the document key
    const iv = encryptedBuffer.subarray(0, 12);
    const authTag = encryptedBuffer.subarray(12, 28);
    const actualEncryptedData = encryptedBuffer.subarray(28);

    const decipher = crypto.createDecipheriv(this.algorithm, documentKey, iv);
    decipher.setAuthTag(authTag);
    const decryptedData = Buffer.concat([decipher.update(actualEncryptedData), decipher.final()]);

    return decryptedData;
  }
}
