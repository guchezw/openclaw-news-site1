'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface GuestbookEntry {
  id: number;
  name: string | null;
  message: string;
  created_at: string;
}

export default function Home() {
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGuestbook();
  }, []);

  async function fetchGuestbook() {
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuestbookEntries(data || []);
    } catch (error) {
      console.error('Error fetching guestbook:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('guestbook').insert([
        {
          name: name.trim() || null,
          message: message.trim(),
        },
      ]);

      if (error) throw error;

      setName('');
      setMessage('');
      fetchGuestbook();
    } catch (error) {
      console.error('Error submitting guestbook:', error);
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* 海洋背景 */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#006994] via-[#003366] to-[#001a33] z-0">
        {/* 气泡动画 */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 animate-pulse"
              style={{
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header - 龙虾主题 */}
      <header className="relative z-10 bg-gradient-to-r from-[#ff6b35] via-[#ff4500] to-[#ff6b35] py-16 px-4 shadow-2xl border-b-4 border-[#cc3700] overflow-hidden">
        <div className="absolute left-[-80px] top-[-50px] text-[200px] opacity-15 transform -rotate-12 animate-bounce" style={{ animationDuration: '3s' }}>🦞</div>
        <div className="absolute right-[-80px] bottom-[-50px] text-[200px] opacity-15 transform rotate-12 animate-bounce" style={{ animationDuration: '4s' }}>🦞</div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4">
            <span className="text-7xl animate-bounce inline-block">🦞</span>
          </div>
          <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg tracking-tight">
            OpenClaw 资讯站
          </h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-lg font-semibold">
              AI 助手框架
            </span>
            <span className="text-white/80 text-2xl">·</span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-lg font-semibold">
              最新动态
            </span>
            <span className="text-white/80 text-2xl">·</span>
            <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full text-lg font-semibold">
              社区资讯
            </span>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* 最新资讯 */}
        <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 mb-10 shadow-2xl border-2 border-[#ffab91] hover:shadow-[#ff6b35]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">📰</span>
            <h2 className="text-4xl font-black bg-gradient-to-r from-[#ff6b35] to-[#ff4500] bg-clip-text text-transparent">
              OpenClaw 最新资讯
            </h2>
          </div>
          <div className="group bg-gradient-to-br from-[#fff5f0] to-[#ffe8e0] border-2 border-[#ffccbc] border-l-[6px] border-l-[#ff6b35] p-8 rounded-2xl hover:shadow-xl hover:shadow-[#ff6b35]/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#ff6b35] transition-colors">
                  <a href="https://docs.openclaw.ai" target="_blank" className="hover:underline">
                    OpenClaw 文档更新
                  </a>
                </h3>
                <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                  官方文档已更新，包含最新的使用指南和 API 参考。
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block bg-gradient-to-r from-[#ff6b35] to-[#ff4500] text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all">
                    📚 官方文档
                  </span>
                  <span className="text-gray-400 text-sm">🕒 最近更新</span>
                </div>
              </div>
              <div className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110">
                🦞
              </div>
            </div>
          </div>
        </section>

        {/* 官方资源 */}
        <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 mb-10 shadow-2xl border-2 border-[#ffab91] hover:shadow-[#ff6b35]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-5xl">🔗</span>
            <h2 className="text-4xl font-black bg-gradient-to-r from-[#ff6b35] to-[#ff4500] bg-clip-text text-transparent">
              官方资源
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="https://docs.openclaw.ai" target="_blank" className="group bg-gradient-to-br from-[#ff6b35] to-[#ff4500] text-white p-8 rounded-2xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff6b35]/40 transition-all duration-300 border-2 border-[#ff8c42] relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🦞</div>
              <span className="text-6xl block mb-4 transform group-hover:scale-110 transition-transform">📚</span>
              <h3 className="text-xl font-bold mb-3">官方文档</h3>
              <p className="text-white/90 text-sm">完整的使用指南</p>
            </a>
            <a href="https://github.com/openclaw/openclaw" target="_blank" className="group bg-gradient-to-br from-[#ff6b35] to-[#ff4500] text-white p-8 rounded-2xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff6b35]/40 transition-all duration-300 border-2 border-[#ff8c42] relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🦞</div>
              <span className="text-6xl block mb-4 transform group-hover:scale-110 transition-transform">💻</span>
              <h3 className="text-xl font-bold mb-3">GitHub 仓库</h3>
              <p className="text-white/90 text-sm">源代码和 Issues</p>
            </a>
            <a href="https://discord.com/invite/clawd" target="_blank" className="group bg-gradient-to-br from-[#ff6b35] to-[#ff4500] text-white p-8 rounded-2xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff6b35]/40 transition-all duration-300 border-2 border-[#ff8c42] relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🦞</div>
              <span className="text-6xl block mb-4 transform group-hover:scale-110 transition-transform">💬</span>
              <h3 className="text-xl font-bold mb-3">Discord 社区</h3>
              <p className="text-white/90 text-sm">开发者交流</p>
            </a>
            <a href="https://clawhub.com" target="_blank" className="group bg-gradient-to-br from-[#ff6b35] to-[#ff4500] text-white p-8 rounded-2xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#ff6b35]/40 transition-all duration-300 border-2 border-[#ff8c42] relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">🦞</div>
              <span className="text-6xl block mb-4 transform group-hover:scale-110 transition-transform">🛒</span>
              <h3 className="text-xl font-bold mb-3">ClawHub</h3>
              <p className="text-white/90 text-sm">技能市场</p>
            </a>
          </div>
        </section>

        {/* 留言板 */}
        <section className="bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border-2 border-[#ffab91] hover:shadow-[#ff6b35]/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">💬</span>
            <h2 className="text-4xl font-black bg-gradient-to-r from-[#ff6b35] to-[#ff4500] bg-clip-text text-transparent">
              留言板
            </h2>
          </div>
          <p className="text-gray-600 mb-10 text-lg">欢迎分享你的使用体验、建议或问题 🦞</p>

          {/* 提交表单 */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[#fff5f0] to-[#ffe8e0] border-2 border-[#ffccbc] p-8 rounded-2xl mb-10 shadow-lg">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#ff6b35] mb-2">你的称呼（可选）</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="怎么称呼你呢？"
                  maxLength={50}
                  className="w-full px-5 py-4 border-2 border-[#ffccbc] rounded-xl focus:outline-none focus:border-[#ff6b35] focus:ring-4 focus:ring-[#ff6b35]/20 transition-all bg-white text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#ff6b35] mb-2">留言内容 <span className="text-red-500">*</span></label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下你的想法、建议或使用体验..."
                  maxLength={1000}
                  rows={5}
                  required
                  className="w-full px-5 py-4 border-2 border-[#ffccbc] rounded-xl focus:outline-none focus:border-[#ff6b35] focus:ring-4 focus:ring-[#ff6b35]/20 transition-all bg-white text-lg resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#ff6b35] via-[#ff4500] to-[#ff6b35] text-white px-10 py-4 rounded-xl font-bold text-lg hover:-translate-y-1 hover:shadow-xl hover:shadow-[#ff6b35]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg bg-[length:200%_auto] animate-gradient"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> 提交中...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    提交留言 🦞
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* 留言列表 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <h3 className="text-3xl font-bold text-[#ff6b35]">最新留言</h3>
              {guestbookEntries.length > 0 && (
                <span className="bg-[#ff6b35] text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {guestbookEntries.length} 条
                </span>
              )}
            </div>
            {loading ? (
              <div className="text-center py-16 text-gray-500 text-lg">
                <span className="animate-spin inline-block text-4xl">🦞</span>
                <p className="mt-4">加载中...</p>
              </div>
            ) : guestbookEntries.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-[#fff5f0] to-[#ffe8e0] rounded-2xl border-2 border-dashed border-[#ffccbc]">
                <span className="text-7xl block mb-4">🦞</span>
                <p className="text-gray-500 text-xl">暂无留言，快来抢沙发吧！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {guestbookEntries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="bg-gradient-to-br from-[#fff5f0] to-[#ffe8e0] border-2 border-[#ffccbc] border-l-[6px] border-l-[#ff6b35] p-6 rounded-2xl hover:shadow-lg hover:shadow-[#ff6b35]/20 hover:-translate-y-1 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff4500] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                          {entry.name ? entry.name[0].toUpperCase() : '🦞'}
                        </div>
                        <div>
                          <div className="font-bold text-[#ff6b35] text-xl">
                            {entry.name || '匿名用户'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(entry.created_at).toLocaleString('zh-CN')}
                          </div>
                        </div>
                      </div>
                      <span className="text-3xl opacity-50">🦞</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg pl-14">
                      {entry.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-[#ff6b35] via-[#ff4500] to-[#ff6b35] py-10 px-4 mt-12 border-t-4 border-[#cc3700]">
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className="text-4xl mb-4">🦞 🦞 🦞</div>
          <p className="text-lg font-semibold">© 2026 OpenClaw 资讯站</p>
          <p className="text-white/80 mt-2">非官方网站，资讯来源于公开渠道</p>
          <p className="text-white/60 text-sm mt-4">
            最后更新：{new Date().toLocaleDateString('zh-CN')}
          </p>
        </div>
      </footer>

      {/* 自定义动画 */}
      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </main>
  );
}
