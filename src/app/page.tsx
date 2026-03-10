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
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* 顶部导航 */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🦞</span>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              OpenClaw 资讯站
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-gray-600">
            <a href="#news" className="hover:text-orange-500 transition-colors">资讯</a>
            <a href="#resources" className="hover:text-orange-500 transition-colors">资源</a>
            <a href="#guestbook" className="hover:text-orange-500 transition-colors">留言板</a>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 to-red-400/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 animate-bounce">
            <span className="text-8xl filter drop-shadow-lg">🦞</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              OpenClaw
            </span>
            <br />
            <span className="text-gray-800">AI 助手框架</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            探索最新的 AI 助手技术动态，获取官方资源，分享你的使用体验
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#guestbook"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              留言互动 🦞
            </a>
            <a
              href="https://docs.openclaw.ai"
              target="_blank"
              className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all border-2 border-orange-200"
            >
              查看文档
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-16">
        {/* 最新资讯 */}
        <section id="news" className="bg-white rounded-3xl p-10 shadow-xl border border-orange-100">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">📰</span>
            <h2 className="text-3xl font-bold text-gray-800">最新资讯</h2>
          </div>
          <div className="space-y-4">
            <div className="group p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-500 transition-colors">
                    <a href="https://docs.openclaw.ai" target="_blank" className="hover:underline">
                      OpenClaw 文档更新
                    </a>
                  </h3>
                  <p className="text-gray-600 mb-3">
                    官方文档已更新，包含最新的使用指南和 API 参考。
                  </p>
                  <span className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                    官方文档
                  </span>
                </div>
                <span className="text-5xl opacity-20 group-hover:opacity-40 transition-opacity">🦞</span>
              </div>
            </div>
          </div>
        </section>

        {/* 官方资源 */}
        <section id="resources" className="bg-white rounded-3xl p-10 shadow-xl border border-orange-100">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-4xl">🔗</span>
            <h2 className="text-3xl font-bold text-gray-800">官方资源</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className="group p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
              >
                <span className="text-5xl block mb-4 transform group-hover:scale-110 transition-transform">{item.icon}</span>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-white/90 text-sm">{item.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* 留言板 */}
        <section id="guestbook" className="bg-white rounded-3xl p-10 shadow-xl border border-orange-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">💬</span>
            <h2 className="text-3xl font-bold text-gray-800">留言板</h2>
          </div>
          <p className="text-gray-600 mb-8">分享你的想法和建议 🦞</p>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl mb-10 border-2 border-orange-100">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">称呼（可选）</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="怎么称呼？"
                  maxLength={50}
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all bg-white"
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
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200 transition-all bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {guestbookEntries.length} 条
                </span>
              )}
            </div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">加载中...</div>
            ) : guestbookEntries.length === 0 ? (
              <div className="text-center py-12 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200">
                <span className="text-6xl block mb-4">🦞</span>
                <p className="text-gray-500">暂无留言，快来抢沙发！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {guestbookEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-lg">
                          {entry.name ? entry.name[0].toUpperCase() : '🦞'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{entry.name || '匿名用户'}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(entry.created_at).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                      </div>
                      <span className="text-3xl opacity-30">🦞</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap pl-15">{entry.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 页脚 */}
      <footer className="bg-white border-t border-orange-100 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <div className="text-3xl mb-3">🦞 🦞 🦞</div>
          <p className="font-semibold">© 2026 OpenClaw 资讯站</p>
          <p className="text-sm mt-2">非官方网站 · 资讯来源于公开渠道</p>
        </div>
      </footer>
    </main>
  );
}
