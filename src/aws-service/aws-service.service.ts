import { CompleteMultipartUploadCommandOutput, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as cloudinary from 'cloudinary';


@Injectable()
export class AwsServiceService {

  private readonly cloudinaryConfig = cloudinary.v2;

  constructor(private readonly configService: ConfigService,) {

    this.cloudinaryConfig.config({
      cloud_name: 'dccis3cgh',
      api_key: '869819747422541',
      api_secret: '8ezIRYFhMJnQBxRzX1Ka8eYViX8',
    });
  }

  private readonly S3ClientInstance = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow('SECRET_ACCESS_KEY'),
    }
  });

  // Initialize Cloudinary with your credentials



  async uploadPublicFile(dataBuffer: Buffer, file, type = 'image') {
    console.log("🚀 ~ AwsServiceService ~ S3ClientInstance:", this.S3ClientInstance)

    const UID = randomUUID();
    const key = `${type}/${UID}-${file.originalname}`;

    try {

      const uploadRequest = new Upload({
        client: this.S3ClientInstance,
        params: {
          Bucket: this.configService.getOrThrow('AWS_BUCKET_NAME'),
          Key: key,
          ACL: 'public-read',
          Body: dataBuffer,
        },
      });

      const uploadResult: CompleteMultipartUploadCommandOutput = await uploadRequest.done();
      return uploadResult.Location;

    } catch (e) {
      console.log("🚀 ~ AwsServiceService ~ uploadPublicFile ~ e:", e)
      throw new BadRequestException('Error while upload file');
    }
  }




  async uploadPublicFileCloudinary(dataBuffer: Buffer) {
    console.log("🚀 ~ AwsServiceService ~ S3ClientInstance:", this.S3ClientInstance)


    try {

      const result : any = await new Promise((resolve, reject) => {

        this.cloudinaryConfig.uploader.upload_stream(
          { resource_type: 'image' },
          (error: any, result) => {
            if (error) {
              console.log("🚀 ~ AwsServiceService ~ result ~ error:", error)
              reject('Error uploading image:');
            } else {
              resolve(result);
            }
          },
        ).end(Buffer.from(dataBuffer));
      });

      console.log('Image uploaded successfully:', result);
      console.log("🚀 ~ AwsServiceService ~ uploadPublicFileCloudinary ~ result.secure_url:", result.secure_url)

      return result.secure_url;

    } catch (e) {
      console.log("🚀 ~ AwsServiceService ~ uploadPublicFile ~ e:", e)
      throw new BadRequestException('Error while upload file');
    }
  }


  async getS3Configuration(): Promise<S3ClientConfig> {
    return {
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('SECRET_ACCESS_KEY'),
      },
    };
  }

}
