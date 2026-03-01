import type {Generate3DViewParams} from "../type";
import {DIMENZA_RENDER_PROMPT} from "./constants";
import puter from "@heyputer/puter.js";

/**
 * Fetches an image from a URL and converts it to a Data URL (Base64 string).
 * 
 * @param url - The URL of the image to fetch.
 * @returns A Promise that resolves to the Data URL string.
 */
export const fetchAsDataUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}: ${response.statusText}`);
    }

    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert blob to Data URL.'));
            }
        };
        reader.onerror = () => reject(reader.error || new Error('Error reading blob with FileReader.'));
        reader.readAsDataURL(blob);
    });
};

export const generate3DView = async ({sourceImage}: Generate3DViewParams) =>{
    const dataUrl = sourceImage.startsWith('data:') ? sourceImage : await fetchAsDataUrl(sourceImage);

    const base64Data = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];

    if (!mimeType || !base64Data) {
        throw new Error('Invalid source image payload');
    }

    const response = await puter.ai.txt2img(DIMENZA_RENDER_PROMPT, {
        provider : "gemini",
        model : "gemini-2.0-flash-image-preview",
        input_image : base64Data,
        input_image_mime_type : mimeType,
        ratio: {w: 1024, h: 1024},
    });
    const rawImageUrl = (response as HTMLImageElement).src ?? null;

    if (!rawImageUrl) return {renderedImage: null, renderedPath : undefined};

    const renderedImage = rawImageUrl.startsWith('data:') ? rawImageUrl : await fetchAsDataUrl(rawImageUrl);
    return {renderedImage, renderedPath : undefined};


}