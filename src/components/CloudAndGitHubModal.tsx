import React, { useState } from 'react';
import { X, Cloud, GitBranch, GitCommit, Check, Copy, Download, RefreshCw, Zap, Server, ShieldCheck, Terminal } from 'lucide-react';
import { cloudStorageOptimizer } from '../utils/cloudStorage';
import { githubSyncManager } from '../utils/githubSync';
import { CloudStorageProvider, Devotional } from '../types';

interface CloudAndGitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  devotionals: Devotional[];
}

export const CloudAndGitHubModal: React.FC<CloudAndGitHubModalProps> = ({
  isOpen,
  onClose,
  devotionals
}) => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'github' | 'workflow'>('cloud');
  const [cloudConfig, setCloudConfig] = useState(cloudStorageOptimizer.getConfig());
  const [gitHubConfig, setGitHubConfig] = useState(githubSyncManager.getConfig());
  const [commits, setCommits] = useState(githubSyncManager.getCommits());
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleProviderChange = (provider: CloudStorageProvider) => {
    const updated = { ...cloudConfig, provider };
    setCloudConfig(updated);
    cloudStorageOptimizer.updateConfig(updated);
    showSavedNotification();
  };

  const handleSaveConfigs = () => {
    cloudStorageOptimizer.updateConfig(cloudConfig);
    githubSyncManager.updateConfig(gitHubConfig);
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopyWorkflow = () => {
    const yaml = githubSyncManager.getGithubWorkflowYaml();
    navigator.clipboard.writeText(yaml);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  const handleDownloadManifest = () => {
    const jsonStr = JSON.stringify(devotionals, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palavra-viva-devotionals-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-slate-100">
                Infraestrutura: Cloud Storage & GitHub CI/CD
              </h3>
              <p className="text-xs text-slate-400">
                Otimização de áudio para mobile e controle de versão contínuo
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl my-4 border border-slate-800">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cloud'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>API de Armazenamento</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'github'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>GitHub CI/CD ({commits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'workflow'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Workflow YAML</span>
          </button>
        </div>

        {/* Tab 1: Cloud Storage Performance & API */}
        {activeTab === 'cloud' && (
          <div className="space-y-4">
            {/* Performance KPIs for Mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Economia de Dados</p>
                <p className="text-base font-bold text-emerald-400 mt-0.5">-68%</p>
                <p className="text-[10px] text-slate-500">Opus vs MP3 raw</p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Latência CDN</p>
                <p className="text-base font-bold text-sky-400 mt-0.5">22ms</p>
                <p className="text-[10px] text-slate-500">Edge no Brasil</p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Cache Hit Rate</p>
                <p className="text-base font-bold text-amber-400 mt-0.5">99.4%</p>
                <p className="text-[10px] text-slate-500">HTTP/2 Edge</p>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Byte-Range Seek</p>
                <p className="text-base font-bold text-emerald-400 mt-0.5">Ativo</p>
                <p className="text-[10px] text-slate-500">Avanço imediato</p>
              </div>
            </div>

            {/* Provider Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Provedor de Armazenamento em Nuvem Ativo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'cloudflare_r2', name: 'Cloudflare R2 + Edge CDN', desc: 'Zero taxa de transferência e cache global instantâneo' },
                  { id: 'cloudinary', name: 'Cloudinary Audio API', desc: 'Transcodificação dinâmica e streaming adaptativo' },
                  { id: 'supabase_storage', name: 'Supabase Storage (S3)', desc: 'Integrado ao banco de dados com CDN global' },
                  { id: 'aws_s3', name: 'Amazon S3 + CloudFront', desc: 'Infraestrutura enterprise com edge locations' }
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProviderChange(p.id as CloudStorageProvider)}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      cloudConfig.provider === p.id
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{p.name}</span>
                      {cloudConfig.provider === p.id && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Fields */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  Bucket Name / Container
                </label>
                <input
                  type="text"
                  value={cloudConfig.bucketName}
                  onChange={(e) => setCloudConfig({ ...cloudConfig, bucketName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                  URL da CDN de Distribuição dos Áudios
                </label>
                <input
                  type="text"
                  value={cloudConfig.endpointUrl}
                  onChange={(e) => setCloudConfig({ ...cloudConfig, endpointUrl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-300">Compressão de Voz Opus (64kbps)</span>
                <input
                  type="checkbox"
                  checked={cloudConfig.enableOpusCompression}
                  onChange={(e) => setCloudConfig({ ...cloudConfig, enableOpusCompression: e.target.checked })}
                  className="accent-amber-500 w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">Cache Imutável Edge CDN (1 ano)</span>
                <input
                  type="checkbox"
                  checked={cloudConfig.cdnEdgeCaching}
                  onChange={(e) => setCloudConfig({ ...cloudConfig, cdnEdgeCaching: e.target.checked })}
                  className="accent-amber-500 w-4 h-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GitHub CI/CD Pipeline & Commits */}
        {activeTab === 'github' && (
          <div className="space-y-4">
            {/* Repo Header & Direct Link */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-100 flex-shrink-0">
                    <GitBranch className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 font-mono">
                      https://github.com/{gitHubConfig.repoOwner}/{gitHubConfig.repoName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Branch: <span className="text-amber-400 font-mono">{gitHubConfig.branch}</span> • CI/CD Automático
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://github.com/${gitHubConfig.repoOwner}/${gitHubConfig.repoName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <span>Abrir no GitHub</span>
                  </a>

                  <button
                    onClick={handleDownloadManifest}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all"
                    title="Baixar arquivo JSON com todos os devocionais para versionamento"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>JSON</span>
                  </button>
                </div>
              </div>

              {/* Editable Repo Configuration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Usuário / Organização no GitHub
                  </label>
                  <input
                    type="text"
                    value={gitHubConfig.repoOwner}
                    onChange={(e) => {
                      const updated = { ...gitHubConfig, repoOwner: e.target.value };
                      setGitHubConfig(updated);
                      githubSyncManager.updateConfig(updated);
                    }}
                    placeholder="cleovaldo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Nome do Repositório
                  </label>
                  <input
                    type="text"
                    value={gitHubConfig.repoName}
                    onChange={(e) => {
                      const updated = { ...gitHubConfig, repoName: e.target.value };
                      setGitHubConfig(updated);
                      githubSyncManager.updateConfig(updated);
                    }}
                    placeholder="palavra-viva-devocionais"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Commits List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Histórico de Commits e Deploys de Áudio
              </h4>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                {commits.map((cmt) => (
                  <div
                    key={cmt.id}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                          {cmt.shortHash}
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ✓ {cmt.status}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {cmt.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-200 font-medium leading-snug">
                        {cmt.message}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        Arquivo: {cmt.audioFileName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GitHub Actions YAML Pipeline */}
        {activeTab === 'workflow' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Arquivo: <strong className="text-amber-300 font-mono">.github/workflows/deploy-audio-cdn.yml</strong>
              </span>
              <button
                onClick={handleCopyWorkflow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all"
              >
                {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWorkflow ? 'YAML Copiado!' : 'Copiar YAML'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[45vh] leading-relaxed">
              {githubSyncManager.getGithubWorkflowYaml()}
            </pre>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {isSaved ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Configurações salvas no app!
              </span>
            ) : (
              'Integração pronta para produção'
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveConfigs}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              Salvar Configurações
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
