import { Body, Controller, Post } from '@nestjs/common';
import { AiGenerateService } from './ai-generate.service';

@Controller('ai-generate')
export class AiGenerateController {
  constructor(private readonly aiGenerateService: AiGenerateService) { }

  @Post()
  async generateMJML(@Body('mjml') mjml: string, @Body('tone') tone: string): Promise<any> {

    return await this.aiGenerateService.generateMJML(tone, mjml)

  }
}
