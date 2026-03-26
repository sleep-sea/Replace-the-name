// reader.js - 读者面板交互
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const authorPanel = document.getElementById('authorPanel');
        const readerPanel = document.getElementById('readerPanel');
        const readerNameInput = document.getElementById('readerNameInput');
        const readerUnlockBtn = document.getElementById('readerUnlockBtn');
        const readerPreview = document.getElementById('readerArticlePreview');

        if (!readerPanel || !readerNameInput || !readerUnlockBtn || !readerPreview) {
            console.error('Reader panel missing required elements');
            return;
        }

        let articleContent = null;

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

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

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

        async function initReaderPanel() {
            try {
                const hasArticle = await loadArticleFromUrl();
                if (hasArticle) {
                    if (authorPanel) authorPanel.classList.add('hidden');
                    readerPanel.classList.remove('hidden');
                    readerUnlockBtn.addEventListener('click', unlockArticle);
                    readerNameInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') unlockArticle();
                    });
                    readerPreview.innerHTML = '👆 请输入你的名字，然后点击「解锁文章」。';
                } else {
                    if (authorPanel) authorPanel.classList.remove('hidden');
                    readerPanel.classList.add('hidden');
                }
            } catch (err) {
                console.error(err);
                if (authorPanel) authorPanel.classList.add('hidden');
                readerPanel.classList.remove('hidden');
                readerPreview.innerHTML = `❌ 加载文章失败: ${err.message}`;
                readerUnlockBtn.disabled = true;
                readerNameInput.disabled = true;
            }
        }

        initReaderPanel();
    });
})();
