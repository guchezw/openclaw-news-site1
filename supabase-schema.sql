-- 创建留言板表
CREATE TABLE IF NOT EXISTS guestbook (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 Row Level Security
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许任何人读取留言
CREATE POLICY "Allow public read access" ON guestbook
  FOR SELECT USING (true);

-- 创建策略：允许任何人插入留言
CREATE POLICY "Allow public insert access" ON guestbook
  FOR INSERT WITH CHECK (true);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);
