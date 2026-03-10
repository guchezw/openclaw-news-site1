// 加载新闻数据
async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        if (!response.ok) throw new Error('Failed to load news');
        const data = await response.json();
        
        const newsList = document.getElementById('news-list');
        newsList.innerHTML = '';
        
        if (data.news && data.news.length > 0) {
            data.news.forEach(item => {
                const newsItem = document.createElement('div');
                newsItem.className = 'news-item';
                newsItem.innerHTML = `
                    <h3><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
                    <div class="meta">
                        <span class="date">${formatDate(item.date)}</span>
                        ${item.author ? `<span class="author">By ${item.author}</span>` : ''}
                    </div>
                    <div class="summary">${item.summary}</div>
                    <span class="source">${item.source}</span>
                `;
                newsList.appendChild(newsItem);
            });
            
            document.getElementById('last-update').textContent = formatDate(data.lastUpdate);
        } else {
            newsList.innerHTML = '<div class="empty-state">暂无最新资讯，请稍后再来～</div>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('news-list').innerHTML = 
            '<div class="empty-state">加载失败，请稍后重试</div>';
    }
}

// 加载更新日志
async function loadChangelog() {
    try {
        const response = await fetch('data/changelog.json');
        if (!response.ok) throw new Error('Failed to load changelog');
        const data = await response.json();
        
        const changelogList = document.getElementById('changelog-list');
        changelogList.innerHTML = '';
        
        if (data.releases && data.releases.length > 0) {
            data.releases.slice(0, 5).forEach(release => {
                const item = document.createElement('div');
                item.className = 'changelog-item';
                item.innerHTML = `
                    <div class="header">
                        <span class="version">${release.version}</span>
                        <span class="date">${formatDate(release.date)}</span>
                    </div>
                    <ul>
                        ${release.changes.map(change => `<li>${change}</li>`).join('')}
                    </ul>
                `;
                changelogList.appendChild(item);
            });
        } else {
            changelogList.innerHTML = '<div class="empty-state">暂无更新记录</div>';
        }
    } catch (error) {
        console.error('Error loading changelog:', error);
        document.getElementById('changelog-list').innerHTML = 
            '<div class="empty-state">加载失败</div>';
    }
}

// 加载留言
async function loadGuestbook() {
    try {
        const response = await fetch('data/guestbook.json');
        const data = response.ok ? await response.json() : { messages: [] };
        
        const guestbookList = document.getElementById('guestbook-list');
        guestbookList.innerHTML = '';
        
        if (data.messages && data.messages.length > 0) {
            // 显示最新的 20 条留言，倒序排列
            const recentMessages = data.messages.slice(-20).reverse();
            recentMessages.forEach(msg => {
                const guestItem = document.createElement('div');
                guestItem.className = 'guestbook-item';
                guestItem.innerHTML = `
                    <div class="header">
                        <span class="name">${escapeHtml(msg.name || '匿名访客')}</span>
                        <span class="time">${formatDate(msg.time)}</span>
                    </div>
                    <div class="message">${escapeHtml(msg.message)}</div>
                `;
                guestbookList.appendChild(guestItem);
            });
        } else {
            guestbookList.innerHTML = '<div class="empty-state">还没有留言，快来抢沙发吧～ 🦞</div>';
        }
    } catch (error) {
        console.error('Error loading guestbook:', error);
        document.getElementById('guestbook-list').innerHTML = 
            '<div class="empty-state">加载留言失败</div>';
    }
}

// 提交留言
async function submitGuestbook() {
    const nameInput = document.getElementById('guest-name');
    const messageInput = document.getElementById('guest-message');
    
    const name = nameInput.value.trim() || '匿名访客';
    const message = messageInput.value.trim();
    
    if (!message) {
        alert('请输入留言内容～ 🦞');
        messageInput.focus();
        return;
    }
    
    if (message.length > 1000) {
        alert('留言内容不能超过 1000 字～');
        return;
    }
    
    // 简单的内容过滤
    const forbiddenWords = ['广告', '推广', 'http://', 'https://'];
    for (const word of forbiddenWords) {
        if (message.toLowerCase().includes(word.toLowerCase())) {
            alert('留言内容包含不允许的词汇～');
            return;
        }
    }
    
    try {
        // 读取现有留言
        const response = await fetch('data/guestbook.json');
        let data = { messages: [] };
        if (response.ok) {
            data = await response.json();
        }
        
        // 添加新留言
        const newMessage = {
            name: name,
            message: message,
            time: Date.now(),
            ip: 'hidden' // 静态网站不记录真实 IP
        };
        
        if (!data.messages) data.messages = [];
        data.messages.push(newMessage);
        
        // 注意：静态网站无法直接写入文件
        // 实际部署时需要：
        // 1. 使用后端 API
        // 2. 使用第三方服务（如 Formspree、Netlify Forms）
        // 3. 使用 GitHub Issues 作为留言存储
        
        // 这里我们模拟成功，并提示用户
        console.log('新留言:', newMessage);
        
        // 尝试使用 GitHub API 保存（如果配置了）
        try {
            await saveGuestbookToGitHub(data);
        } catch (ghError) {
            console.log('GitHub 保存失败，仅本地显示');
        }
        
        alert('留言提交成功！感谢您的反馈～ 🦞\n\n（注：静态网站环境下留言仅本地显示，部署后需要配置后端存储）');
        
        // 清空表单
        nameInput.value = '';
        messageInput.value = '';
        
        // 重新加载留言
        loadGuestbook();
    } catch (error) {
        console.error('Error submitting guestbook:', error);
        alert('留言提交失败，请稍后重试');
    }
}

// 将留言保存到 GitHub（可选功能）
async function saveGuestbookToGitHub(data) {
    // 这需要配置 GitHub Token
    // 这里只是示例代码
    const GITHUB_TOKEN = ''; // 从配置中读取
    const REPO = 'guchezw/openclaw-news-site';
    
    if (!GITHUB_TOKEN) return;
    
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents/data/guestbook.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update guestbook',
            content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
            sha: await getCurrentSha()
        })
    });
    
    if (!response.ok) throw new Error('GitHub API failed');
}

async function getCurrentSha() {
    const GITHUB_TOKEN = '';
    const REPO = 'guchezw/openclaw-news-site';
    const response = await fetch(`https://api.github.com/repos/${REPO}/contents/data/guestbook.json`, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
    });
    const data = await response.json();
    return data.sha;
}

// 格式化日期
function formatDate(timestamp) {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 相对时间显示
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    
    // 超过 7 天显示具体日期
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// HTML 转义（防止 XSS）
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
    loadChangelog();
    loadGuestbook();
    
    // 每 5 分钟刷新一次新闻
    setInterval(loadNews, 5 * 60 * 1000);
});
