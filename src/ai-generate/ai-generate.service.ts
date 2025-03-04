import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { Buffer } from 'buffer';
import { AwsServiceService } from 'src/aws-service/aws-service.service';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AiGenerateService {

    private llm: ChatOpenAI;

    constructor(private readonly awsServiceService: AwsServiceService) {

        this.llm = new ChatOpenAI({
            apiKey: "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",
            model: "gpt-4o-mini",
            temperature: 0,
        });

    }

    async callGpt4o(prompt: string, data: string): Promise<string> {

        try {

            const response = await this.llm.invoke([
                {
                    role: "system",
                    content: prompt,
                },
                {
                    role: "user",
                    content: data,
                },
            ]);
            return String(response.content);
        } catch (error) {
            console.error('Error calling GPT-4o:', error);
            throw new Error('Error calling GPT-4o');
        }
    }

    async generateImageInStableModel(prompt: string): Promise<Buffer> {

        const payload = {
            prompt: prompt,
            output_format: 'jpeg',
        };

        const form = new FormData();
        form.append('prompt', payload.prompt);
        form.append('output_format', payload.output_format);

        const response = await axios.post(
            'https://api.stability.ai/v2beta/stable-image/generate/ultra',
            form,
            {
                headers: {
                    Authorization: `Bearer sk-cclTJWoQrAagNr1Mn837o5cDU9klqZPYw6CxFSHzTZwiQDVV`,
                    Accept: '',
                    ...form.getHeaders(),
                },
                responseType: 'arraybuffer',
            },
        );

        return Buffer.from(response.data);

    }

    async generateAndUploadImage(prompt: string): Promise<string> {

        const imageBuffer = await this.generateImageInStableModel(prompt);
        console.log("🚀 ~ AiGenerateService ~ generateAndUploadImage ~ imageBuffer:", imageBuffer)
        const image = await this.awsServiceService.uploadPublicFileCloudinary(imageBuffer);
        console.log("🚀 ~ AiGenerateService ~ generateAndUploadImage ~ image:", image)
        return String(image)
    }

    async generateMJML(tone: string, mjml: string) {
        console.log("🚀 ~ AiGenerateService ~ generateMJML ~ mjml:", mjml)
        console.log("🚀 ~ AiGenerateService ~ generateMJML ~ tone:", tone)

        const mjmlPrompt = `I need you to modify the provided MJML email template to have a ${tone} tone. The content, body, title, style, background color, and theme should reflect this playful tone, but the structure, size, height, width, font sizes, and other dimensional aspects must remain unchanged. Do not alter the header or footer or navabar content.Change the entire theme & background Colour based on the ${tone} tone.If any font is changed, make sure to adjust the corresponding font size as needed to maintain the overall layout and prevent breaking the HTML. Please do not alter the overall structure or dimensions of the template. You can modify the tone through changes in the language, color scheme, and design elements that reflect the tone, such as background colors, button colors, and text color. Output the result as MJML only, without extra spaces, new lines, or lines. Ensure that all HTML is aligned perfectly. If there are any images ,Must  replace them with dynamic strings like ###image1###, ###image2###, except for the logo and footer images. Ensure Also, add a ${tone} tone image new prompt for each image, including appropriate content as alt text. Keep th`

        const imagePrompt = `Please review this MJML code and identify the ###image1### placeholder. Based on the context of the content & ${tone} tone, provide a prompt for an appropriate image and suggest the ideal width for the image.Just Give the prompt only No other text no needed`

        const modifiedMJML = await this.callGpt4o(mjmlPrompt, mjml)
        console.log("🚀 ~ AiGenerateService ~ generateMJML ~ modifiedMJML:", modifiedMJML)
        const prompt = await this.callGpt4o(imagePrompt, modifiedMJML)
        console.log("🚀 ~ AiGenerateService ~ generateMJML ~ prompt:", prompt)

        const image = await this.generateAndUploadImage(prompt)
        console.log("🚀 ~ AiGenerateService ~ generateMJML ~ image:", image)
        console.log("🚀 ~ AiGenerateService ~ generateMJML ~ image:", '')
        const redefined = await modifiedMJML.replace(/###image1###/g, image);
        console.log("🚀 ~ AiGenerateService ~ generateMJML ~ redfiened:", redefined)
        return { mjml: redefined }

    }

}






