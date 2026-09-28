import { GitHubCommit, GitHubConfig } from '../types';

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  repoOwner: 'cleovaldo',
  repoName: 'palavra-viva-devocionais',
  branch: 'main',
  personalAccessToken: 'ghp_live_audio_sync_demo_token',
  autoDeployWorkflow: true,
  commitPrefix: 'feat(audio-devocional):',
  lastSyncTimestamp: new Date().toISOString()
};

export const INITIAL_COMMITS: GitHubCommit[] = [
  {
    id: 'cmt-1',
    hash: '8f7a23c914bf689e21de640194ad1b827361a293',
    shortHash: '8f7a23c',
    message: 'feat(audio-devocional): add 2026-09-28 "A Cruz: O Poder da Reconciliação e Esperança" [Billy Graham Special]',
    author: 'Pastor Cleovaldo (via Palavra Viva Studio)',
    timestamp: 'Hoje, há 2 horas',
    devotionalTitle: 'A Cruz: O Poder da Reconciliação e Esperança',
    audioFileName: 'audio/2026-09-28-billy-graham-cruz.opus',
    status: 'deployed',
    workflowRunId: 'actions/runs/184920419'
  },
  {
    id: 'cmt-2',
    hash: '3e198ba46c59b83a009021bf7b134819e917d442',
    shortHash: '3e198ba',
    message: 'feat(audio-devocional): add 2026-09-27 "Paz em Meio à Tempestade Diária"',
    author: 'Pastor Cleovaldo (via Palavra Viva Studio)',
    timestamp: 'Ontem, 06:15',
    devotionalTitle: 'Paz em Meio à Tempestade Diária',
    audioFileName: 'audio/2026-09-27-paz-tempestade.opus',
    status: 'deployed',
    workflowRunId: 'actions/runs/184810231'
  },
  {
    id: 'cmt-3',
    hash: 'c45b789012ea354fbc1029abde17482938102381',
    shortHash: 'c45b789',
    message: 'chore(ci): setup GitHub Actions automated Cloud CDN sync & audio transcode pipeline',
    author: 'GitHub Actions Bot',
    timestamp: '26 de Setembro',
    devotionalTitle: 'CI/CD Pipeline Setup',
    audioFileName: '.github/workflows/deploy-audio-cdn.yml',
    status: 'deployed',
    workflowRunId: 'actions/runs/184690184'
  }
];

export class GitHubSyncManager {
  private config: GitHubConfig;
  private commits: GitHubCommit[];

  constructor() {
    this.config = this.loadConfig();
    this.commits = this.loadCommits();
  }

  public getConfig(): GitHubConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<GitHubConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  public getCommits(): GitHubCommit[] {
    return this.commits;
  }

  public async commitAndDeployDevotional(params: {
    devotionalTitle: string;
    audioFileName: string;
    date: string;
    passageRef: string;
    cloudUrl: string;
  }): Promise<GitHubCommit> {
    const randomHex = Math.random().toString(16).substring(2, 9);
    const fullHash = randomHex + Math.random().toString(16).substring(2, 33);
    const cleanDate = params.date || new Date().toISOString().split('T')[0];

    const commitMessage = `${this.config.commitPrefix} publish "${params.devotionalTitle}" (${cleanDate}) [deploy:cdn]`;

    const newCommit: GitHubCommit = {
      id: 'cmt-' + Date.now(),
      hash: fullHash,
      shortHash: randomHex,
      message: commitMessage,
      author: `${this.config.repoOwner} (via Palavra Viva Studio)`,
      timestamp: 'Agora mesmo',
      devotionalTitle: params.devotionalTitle,
      audioFileName: params.audioFileName,
      status: 'deployed',
      workflowRunId: `actions/runs/${Math.floor(100000000 + Math.random() * 900000000)}`
    };

    this.commits.unshift(newCommit);
    this.config.lastSyncTimestamp = new Date().toISOString();
    this.saveConfig();
    this.saveCommits();

    return newCommit;
  }

  public getGithubWorkflowYaml(): string {
    return `name: Deploy Áudios Devocionais & CDN Sync

on:
  push:
    branches: [ "${this.config.branch}" ]
    paths:
      - 'audio/**'
      - 'data/devotionals.json'
  workflow_dispatch:

jobs:
  optimize-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repositório Palavra Viva
        uses: actions/checkout@v4

      - name: Setup FFmpeg para Otimização de Áudio Opus
        uses: FedericoCarboni/setup-ffmpeg@v3
        with:
          ffmpeg-version: '6.1.1'

      - name: Transcodificar Áudios para Opus/WebM (64kbps Voice Optimized)
        run: |
          mkdir -p dist/audio-cdn
          for f in audio/*.{mp3,wav,m4a,webm}; do
            [ -e "$f" ] || continue
            filename=$(basename -- "$f")
            base="\${filename%.*}"
            echo "Otimizando $f para dist/audio-cdn/$base.opus..."
            ffmpeg -y -i "$f" -c:a libopus -b:a 64k -vbr on -compression_level 10 "dist/audio-cdn/$base.opus"
          done

      - name: Deploy para Armazenamento em Nuvem / CDN Edge
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --acl public-read --follow-symlinks --delete --cache-control "public, max-age=31536000, immutable"
        env:
          AWS_S3_BUCKET: \${{ secrets.CLOUD_STORAGE_BUCKET }}
          AWS_ACCESS_KEY_ID: \${{ secrets.CLOUD_STORAGE_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: \${{ secrets.CLOUD_STORAGE_SECRET }}
          AWS_S3_ENDPOINT: \${{ secrets.CLOUD_STORAGE_ENDPOINT }}
          SOURCE_DIR: 'dist/audio-cdn'

      - name: Notificar Mobile App & Limpar Cache da CDN
        run: |
          echo "Deploy contínuo finalizado com sucesso! CDN pronta para streaming mobile."
`;
  }

  private saveConfig() {
    try {
      localStorage.setItem('palavra_viva_github_config', JSON.stringify(this.config));
    } catch {}
  }

  private loadConfig(): GitHubConfig {
    try {
      const saved = localStorage.getItem('palavra_viva_github_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_GITHUB_CONFIG;
  }

  private saveCommits() {
    try {
      localStorage.setItem('palavra_viva_github_commits', JSON.stringify(this.commits));
    } catch {}
  }

  private loadCommits(): GitHubCommit[] {
    try {
      const saved = localStorage.getItem('palavra_viva_github_commits');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_COMMITS;
  }
}

export const githubSyncManager = new GitHubSyncManager();
