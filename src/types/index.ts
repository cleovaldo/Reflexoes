export interface Devotional {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  formattedDate: string;
  passageRef: string; // e.g., "João 3:16"
  verseText: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  durationSeconds: number;
  audioUrl: string;
  audioSizeFormatted: string;
  audioFormat: 'opus' | 'webm' | 'mp3' | 'aac';
  optimizedViaCloud: boolean;
  cloudCdnUrl?: string;
  compressionRatio?: string; // e.g. "-64%"
  githubCommitHash?: string;
  reflectionText: string;
  prayerText: string;
  tags: string[];
  likesCount: number;
  sharesCount: number;
  listensCount: number;
  isBillyGrahamSpecial?: boolean;
  coverImage?: string;
}

export type CloudStorageProvider = 'cloudflare_r2' | 'cloudinary' | 'supabase_storage' | 'aws_s3';

export interface CloudStorageConfig {
  provider: CloudStorageProvider;
  bucketName: string;
  endpointUrl: string;
  apiKey: string;
  enableOpusCompression: boolean;
  cdnEdgeCaching: boolean;
  autoTranscode: boolean;
  simulatedUploadSuccess: boolean;
}

export interface GitHubConfig {
  repoOwner: string;
  repoName: string;
  branch: string;
  personalAccessToken: string;
  autoDeployWorkflow: boolean;
  commitPrefix: string;
  lastSyncTimestamp?: string;
}

export interface GitHubCommit {
  id: string;
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  timestamp: string;
  devotionalTitle: string;
  audioFileName: string;
  status: 'deployed' | 'processing' | 'queued';
  workflowRunId?: string;
}

export interface AudioPlaybackState {
  currentDevotional: Devotional | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  showFullScreen: boolean;
}
