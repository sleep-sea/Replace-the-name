// reader.js - 读者面板交互
(function() {
    document.addEventListener('DOMContentLoaded', () => {
        const authorPanel = document.getElementById('authorPanel');
        const readerPanel = document.getElementById('readerPanel');
        const readerNameInput = document.getElementById('readerNameInput');
        const readerNicknameInput = document.getElementById('readerNicknameInput');
        const readerUnlockBtn = document.getElementById('readerUnlockBtn');
        const readerPreview = document.getElementById('readerArticlePreview');

        if (!readerPanel || !readerNameInput || !readerNicknameInput || !readerUnlockBtn || !readerPreview) {
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

        // 替换所有占位符
        function renderArticle(name, nickname) {
            if (!articleContent) {
                readerPreview.innerHTML = '文章内容加载失败，请刷新页面重试。';
                return;
            }
            if ((!name || name.trim() === '') && (!nickname || nickname.trim() === '')) {
                readerPreview.innerHTML = '请输入你的名字和昵称，然后点击「解锁文章」';
                return;
            }

            let replaced = articleContent;
            // 替换 {{name}} 占位符
            if (name && name.trim()) {
                const nameRegex = new RegExp(escapeRegExp('{{name}}'), 'g');
                replaced = replaced.replace(nameRegex, name);
            }
            // 替换 {{nickname}} 占位符
            if (nickname && nickname.trim()) {
                const nicknameRegex = new RegExp(escapeRegExp('{{nickname}}'), 'g');
                replaced = replaced.replace(nicknameRegex, nickname);
            }

            readerPreview.innerHTML = replaced.replace(/\n/g, '<br>');
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function unlockArticle() {
            const name = readerNameInput.value.trim();
            const nickname = readerNicknameInput.value.trim();
            if (name === '' && nickname === '') {
                showToast('请至少填写名字或昵称', 'warning');
                readerNameInput.focus();
                return;
            }
            renderArticle(name, nickname);
            const welcomeMsg = name ? `欢迎 ${name}` : `欢迎 ${nickname}`;
            showToast(`${welcomeMsg}，请开始阅读吧`, 'success');
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
                    readerNicknameInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') unlockArticle();
                    });
                    readerPreview.innerHTML = '👆 请输入你的名字和昵称，然后点击「解锁文章」。';
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
                readerNicknameInput.disabled = true;
            }
        }

        initReaderPanel();
    });
})();
