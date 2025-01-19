export interface AffirmationRepository {
    getRandomAffirmation(): Promise<string> | null
}