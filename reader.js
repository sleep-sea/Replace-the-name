// reader.js - 读者面板交互

const authorPanel = document.getElementById('authorPanel');
const readerPanel = document.getElementById('readerPanel');
const readerNameInput = document.getElementById('readerNameInput');
const readerUnlockBtn = document.getElementById('readerUnlockBtn');
const readerPreview = document.getElementById('readerArticlePreview');

let articleContent = null; // 存储从URL加载的文章内容

// 从URL参数中获取 Gist ID 并加载内容
async function loadArticleFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const gistId = urlParams.get('gist');
    
    if (gistId) {
        try {
            articleContent = await fetchGistContent(gistId);
            return true;
        } catch (err) {
            throw new Error(`无法加载 Gist: ${err.message}`);
        }
    }
    return false;
}

// 渲染文章（替换占位符）
function renderArticle(name) {
    if (!articleContent) {
        readerPreview.innerHTML = '文章内容加载失败，请刷新页面重试。';
        return;
    }
    if (!name || name.trim() === '') {
        readerPreview.innerHTML = '请输入你的名字，然后点击「解锁文章」';
        return;
    }
    const regex = new RegExp(escapeRegExp(CONFIG.PLACEHOLDER), 'g');
    const replaced = articleContent.replace(regex, name);
    readerPreview.innerHTML = replaced.replace(/\n/g, '<br>');
}

// 转义正则特殊字符
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 解锁文章
function unlockArticle() {
    const name = readerNameInput.value.trim();
    if (name === '') {
        showToast('请输入你的名字', 'warning');
        readerNameInput.focus();
        return;
    }
    renderArticle(name);
    showToast(`欢迎 ${name}，请开始阅读吧`, 'success');
}

// 初始化读者面板
async function initReaderPanel() {
    try {
        const hasArticle = await loadArticleFromUrl();
        if (hasArticle) {
            // 切换到读者模式：隐藏作者面板，显示读者面板
            authorPanel.classList.add('hidden');
            readerPanel.classList.remove('hidden');
            
            readerUnlockBtn.addEventListener('click', unlockArticle);
            readerNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') unlockArticle();
            });
            readerPreview.innerHTML = '👆 请输入你的名字，然后点击「解锁文章」。';
        } else {
            // 没有 gist 参数，保持作者面板（默认状态）
            // 但为了防止读者面板意外显示，确保它被隐藏
            authorPanel.classList.remove('hidden');
            readerPanel.classList.add('hidden');
        }
    } catch (err) {
        console.error(err);
        // 加载失败时，依然切换到读者模式，但显示错误信息
        authorPanel.classList.add('hidden');
        readerPanel.classList.remove('hidden');
        readerPreview.innerHTML = `❌ 加载文章失败: ${err.message}`;
        readerUnlockBtn.disabled = true;
        readerNameInput.disabled = true;
    }
}

// 执行初始化
initReaderPanel();
