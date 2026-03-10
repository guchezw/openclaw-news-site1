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
    <main className="relative z-10 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-lobster-500/95 to-lobster-600/95 py-12 px-4 shadow-lg border-b-4 border-lobster-600 relative overflow-hidden">
        <div className="absolute left-[-50px] top-[-30px] text-[150px] opacity-10 transform -rotate-15">🦞</div>
        <div className="absolute right-[-50px] bottom-[-30px] text-[150px] opacity-10 transform rotate-15">🦞</div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl font-bold text-white mb-3 text-shadow-lg">🦞 OpenClaw 资讯站</h1>
          <p className="text-lobster-100 text-xl text-shadow">AI 助手框架 · 最新动态 · 社区资讯</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 最新资讯 */}
        <section className="bg-white/95 backdrop-blur rounded-2xl p-10 mb-8 shadow-xl border-2 border-lobster-400">
          <h2 className="text-4xl font-bold text-lobster-600 mb-8 border-b-4 border-lobster-500 pb-3 inline-block">
            📰 OpenClaw 最新资讯
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-lobster-50 to-lobster-100 border-2 border-lobster-200 border-l-4 border-l-lobster-500 p-6 rounded-lg hover:shadow-lg hover:translate-x-2 transition-all">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                <a href="https://docs.openclaw.ai" target="_blank" className="text-lobster-500 hover:text-lobster-600 hover:underline">
                  OpenClaw 文档更新
                </a>
              </h3>
              <p className="text-gray-600 mb-3">官方文档已更新，包含最新的使用指南和 API 参考。</p>
              <span className="inline-block bg-gradient-to-r from-lobster-500 to-lobster-600 text-white px-4 py-1 rounded-full text-sm shadow-md">官方文档</span>
            </div>
          </div>
        </section>

        {/* 官方资源 */}
        <section className="bg-white/95 backdrop-blur rounded-2xl p-10 mb-8 shadow-xl border-2 border-lobster-400">
          <h2 className="text-4xl font-bold text-lobster-600 mb-8 border-b-4 border-lobster-500 pb-3 inline-block">
            🔗 官方资源
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="https://docs.openclaw.ai" target="_blank" className="bg-gradient-to-br from-lobster-500 to-lobster-600 text-white p-8 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all border-2 border-lobster-400 shadow-lg text-center">
              <span className="text-5xl block mb-4">📚</span>
              <h3 className="text-lg font-bold mb-2 text-shadow">官方文档</h3>
              <p className="text-lobster-100 text-sm">完整的使用指南</p>
            </a>
            <a href="https://github.com/openclaw/openclaw" target="_blank" className="bg-gradient-to-br from-lobster-500 to-lobster-600 text-white p-8 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all border-2 border-lobster-400 shadow-lg text-center">
              <span className="text-5xl block mb-4">💻</span>
              <h3 className="text-lg font-bold mb-2 text-shadow">GitHub 仓库</h3>
              <p className="text-lobster-100 text-sm">源代码和 Issues</p>
            </a>
            <a href="https://discord.com/invite/clawd" target="_blank" className="bg-gradient-to-br from-lobster-500 to-lobster-600 text-white p-8 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all border-2 border-lobster-400 shadow-lg text-center">
              <span className="text-5xl block mb-4">💬</span>
              <h3 className="text-lg font-bold mb-2 text-shadow">Discord 社区</h3>
              <p className="text-lobster-100 text-sm">开发者交流</p>
            </a>
            <a href="https://clawhub.com" target="_blank" className="bg-gradient-to-br from-lobster-500 to-lobster-600 text-white p-8 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all border-2 border-lobster-400 shadow-lg text-center">
              <span className="text-5xl block mb-4">🛒</span>
              <h3 className="text-lg font-bold mb-2 text-shadow">ClawHub</h3>
              <p className="text-lobster-100 text-sm">技能市场</p>
            </a>
          </div>
        </section>

        {/* 留言板 */}
        <section className="bg-white/95 backdrop-blur rounded-2xl p-10 shadow-xl border-2 border-lobster-400">
          <h2 className="text-4xl font-bold text-lobster-600 mb-3 border-b-4 border-lobster-500 pb-3 inline-block">
            💬 留言板
          </h2>
          <p className="text-gray-600 mb-8">欢迎分享你的使用体验、建议或问题</p>

          {/* 提交表单 */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-lobster-50 to-lobster-100 border-2 border-lobster-200 p-8 rounded-xl mb-10">
            <div className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的称呼（可选）"
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-lobster-200 rounded-lg focus:outline-none focus:border-lobster-500 focus:ring-2 focus:ring-lobster-500/20 transition-all bg-white"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="写下你的想法、建议或使用体验..."
                maxLength={1000}
                rows={4}
                required
                className="w-full px-4 py-3 border-2 border-lobster-200 rounded-lg focus:outline-none focus:border-lobster-500 focus:ring-2 focus:ring-lobster-500/20 transition-all bg-white resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-lobster-500 to-lobster-600 text-white px-8 py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {submitting ? '提交中...' : '提交留言'} 🦞
              </button>
            </div>
          </form>

          {/* 留言列表 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-lobster-600 mb-4">最新留言</h3>
            {loading ? (
              <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : guestbookEntries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">暂无留言，快来抢沙发吧！🦞</div>
            ) : (
              guestbookEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gradient-to-br from-lobster-50 to-lobster-100 border-2 border-lobster-200 border-l-4 border-l-lobster-500 p-6 rounded-xl hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                    <div className="font-bold text-lobster-600 text-lg">
                      {entry.name || '匿名用户'} 🦞
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(entry.created_at).toLocaleString('zh-CN')}
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.message}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-lobster-500/95 to-lobster-600/95 py-8 px-4 mt-12 border-t-4 border-lobster-600 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-white">
          <p>© 2026 OpenClaw 资讯站 | 非官方网站，资讯来源于公开渠道</p>
          <p className="text-lobster-100 text-sm mt-2">最后更新：{new Date().toLocaleDateString('zh-CN')}</p>
        </div>
      </footer>
    </main>
  );
}
