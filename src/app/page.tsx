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
    <main className="relative min-h-screen bg-gradient-to-b from-[#006994] via-[#003366] to-[#001a33]">
      {/* 气泡背景动画 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-pulse"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative py-16 px-4 border-b border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block mb-6 text-6xl animate-bounce">🦞</div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            OpenClaw 资讯站
          </h1>
          <p className="text-xl text-white/80 font-medium">
            AI 助手框架 · 最新动态 · 社区资讯
          </p>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-4 py-12 space-y-12">
        {/* 最新资讯 */}
        <section className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">📰</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff4500] bg-clip-text text-transparent">
              OpenClaw 最新资讯
            </h2>
          </div>
          <div className="bg-gradient-to-r from-[#fff5f0] to-[#ffe8e0] border-l-4 border-[#ff6b35] p-6 rounded-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              <a href="https://docs.openclaw.ai" target="_blank" className="text-[#ff6b35] hover:underline">
                OpenClaw 文档更新
              </a>
            </h3>
            <p className="text-gray-600 mb-4">官方文档已更新，包含最新的使用指南和 API 参考。</p>
            <div className="flex gap-4">
              <span className="inline-block bg-[#ff6b35] text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                📚 官方文档
              </span>
              <span className="inline-block text-gray-500 text-sm">
                🕒 最近更新
              </span>
            </div>
          </div>
        </section>

        {/* 官方资源 */}
        <section className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🔗</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff4500] bg-clip-text text-transparent">
              官方资源
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '📚', title: '官方文档', desc: '完整的使用指南', url: 'https://docs.openclaw.ai' },
              { icon: '💻', title: 'GitHub', desc: '源代码和 Issues', url: 'https://github.com/openclaw/openclaw' },
              { icon: '💬', title: 'Discord', desc: '开发者交流', url: 'https://discord.com/invite/clawd' },
              { icon: '🛒', title: 'ClawHub', desc: '技能市场', url: 'https://clawhub.com' },
            ].map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                className="group bg-gradient-to-br from-[#ff6b35] to-[#ff4500] text-white p-6 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <span className="text-4xl block mb-3">{item.icon}</span>
                <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                <p className="text-white/90 text-sm">{item.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* 留言板 */}
        <section className="bg-white/95 backdrop-blur rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">💬</span>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff6b35] to-[#ff4500] bg-clip-text text-transparent">
              留言板
            </h2>
          </div>
          <p className="text-gray-600 mb-8">欢迎分享你的使用体验、建议或问题</p>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-r from-[#fff5f0] to-[#ffe8e0] p-6 rounded-2xl mb-8 border-2 border-[#ffccbc]">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">称呼（可选）</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="怎么称呼？"
                  maxLength={50}
                  className="w-full px-4 py-3 border-2 border-[#ffccbc] rounded-xl focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">留言 <span className="text-red-500">*</span></label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下你的想法..."
                  maxLength={1000}
                  rows={4}
                  required
                  className="w-full px-4 py-3 border-2 border-[#ffccbc] rounded-xl focus:outline-none focus:border-[#ff6b35] focus:ring-2 focus:ring-[#ff6b35]/20 transition-all bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-[#ff6b35] to-[#ff4500] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '提交中...' : '提交留言 🦞'}
              </button>
            </div>
          </form>

          {/* 留言列表 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-gray-800">最新留言</h3>
              {guestbookEntries.length > 0 && (
                <span className="bg-[#ff6b35] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {guestbookEntries.length} 条
                </span>
              )}
            </div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : guestbookEntries.length === 0 ? (
              <div className="text-center py-12 bg-[#fff5f0] rounded-2xl border-2 border-dashed border-[#ffccbc]">
                <span className="text-6xl block mb-4">🦞</span>
                <p className="text-gray-500">暂无留言，快来抢沙发！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {guestbookEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-gradient-to-r from-[#fff5f0] to-[#ffe8e0] border-l-4 border-[#ff6b35] p-6 rounded-2xl"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ff4500] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                          {entry.name ? entry.name[0].toUpperCase() : '🦞'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{entry.name || '匿名用户'}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(entry.created_at).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap pl-15">{entry.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-white/80">
          <div className="text-3xl mb-3">🦞 🦞 🦞</div>
          <p className="font-semibold">© 2026 OpenClaw 资讯站</p>
          <p className="text-sm mt-2">非官方网站 · 资讯来源于公开渠道</p>
        </div>
      </footer>
    </main>
  );
}
