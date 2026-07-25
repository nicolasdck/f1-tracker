export interface LollipopmanMatch {
    videoId: string | null;
    title?: string;
}
export declare function findLollipopmanVideo(apiKey: string, raceDate: string, keywords: string[]): Promise<LollipopmanMatch>;
