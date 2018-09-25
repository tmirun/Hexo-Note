export interface UpdateCheckResult {
  version: string;
  files: any[];
  path: string;
  sha512: string;
  releaseDate: string;
  releaseName: string;
  releaseNotes: string;
}
