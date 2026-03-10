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
    <main className="min-h-screen bg-gradient-to-br from-[#AF98FF] via-[#9B7FE8] to-[#8A6EE5]">
      {/* Header */}
      <header className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-4 text-6xl">🦞</div>
          <h1 className="text-5xl font-black text-white mb-3">
            OpenClaw 资讯站
          </h1>
          <p className="text-xl text-white/90 font-medium">
            AI 助手框架 · 最新动态 · 社区资讯
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* 主内容卡片 */}
        <div className="bg-white rounded-t-[24px] rounded-b-lg shadow-2xl p-8 md:p-12">
          
          {/* 最新资讯 */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📰</span>
              <h2 className="text-3xl font-bold text-[#3F51B5]">
                OpenClaw 最新资讯
              </h2>
            </div>
            <div className="bg-gradient-to-r from-[#fff5f0] to-[#ffe8e0] border-l-4 border-[#ff6b35] p-6 rounded-xl">
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
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🔗</span>
              <h2 className="text-3xl font-bold text-[#3F51B5]">
                官方资源
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://docs.openclaw.ai" target="_blank" className="bg-gradient-to-br from-[#7A5CE9] to-[#5B3DB8] text-white p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all">
                <span className="text-4xl block mb-3">📚</span>
                <h3 className="text-lg font-bold mb-1">官方文档</h3>
                <p className="text-white/90 text-sm">完整的使用指南</p>
              </a>
              <a href="https://github.com/openclaw/openclaw" target="_blank" className="bg-gradient-to-br from-[#7A5CE9] to-[#5B3DB8] text-white p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all">
                <span className="text-4xl block mb-3">💻</span>
                <h3 className="text-lg font-bold mb-1">GitHub</h3>
                <p className="text-white/90 text-sm">源代码和 Issues</p>
              </a>
              <a href="https://discord.com/invite/clawd" target="_blank" className="bg-gradient-to-br from-[#7A5CE9] to-[#5B3DB8] text-white p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all">
                <span className="text-4xl block mb-3">💬</span>
                <h3 className="text-lg font-bold mb-1">Discord</h3>
                <p className="text-white/90 text-sm">开发者交流</p>
              </a>
              <a href="https://clawhub.com" target="_blank" className="bg-gradient-to-br from-[#7A5CE9] to-[#5B3DB8] text-white p-6 rounded-xl hover:-translate-y-1 hover:shadow-xl transition-all">
                <span className="text-4xl block mb-3">🛒</span>
                <h3 className="text-lg font-bold mb-1">ClawHub</h3>
                <p className="text-white/90 text-sm">技能市场</p>
              </a>
            </div>
          </section>

          {/* 留言板 */}
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#3F51B5]">
                留言板
              </h2>
            </div>
            <div className="h-1 w-16 bg-[#3F51B5] mb-6"></div>
            <p className="text-gray-700 mb-8 text-lg">
              欢迎分享你的使用体验、建议或问题
            </p>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="mb-10">
              <div className="space-y-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="你的称呼 (可选)"
                  maxLength={50}
                  className="w-full px-4 py-4 border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#7A5CE9] focus:ring-2 focus:ring-[#7A5CE9]/20 transition-all bg-white text-base"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="写下你的想法、建议或使用体验..."
                  maxLength={1000}
                  rows={5}
                  required
                  className="w-full px-4 py-4 border border-[#DDDDDD] rounded-xl focus:outline-none focus:border-[#7A5CE9] focus:ring-2 focus:ring-[#7A5CE9]/20 transition-all bg-white text-base resize-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#7A5CE9] to-[#5B3DB8] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {submitting ? '提交中...' : '提交留言 🦞'}
                </button>
              </div>
            </form>

            {/* 留言列表 */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-gray-800">最新留言</h3>
                {guestbookEntries.length > 0 && (
                  <span className="bg-[#7A5CE9] text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {guestbookEntries.length} 条
                  </span>
                )}
              </div>
              {loading ? (
                <div className="text-center py-12 text-gray-500">加载中...</div>
              ) : guestbookEntries.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <span className="text-6xl block mb-4">🦞</span>
                  <p className="text-gray-500">暂无留言，快来抢沙发！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {guestbookEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="border-l-4 border-[#7A5CE9] pl-4 py-2"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-[#3F51B5] text-lg">
                          {entry.name || '管理员'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(entry.created_at).toLocaleString('zh-CN')}
                        </div>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {entry.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-white/80">
        <div className="text-3xl mb-3">🦞 🦞 🦞</div>
        <p className="font-semibold">© 2026 OpenClaw 资讯站</p>
        <p className="text-sm mt-2">非官方网站 · 资讯来源于公开渠道</p>
      </footer>
    </main>
  );
}
